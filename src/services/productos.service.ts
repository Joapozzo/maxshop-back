import { prisma } from '../index';
import { IIva, IPaginatedResponse, IMarca } from '../types';
import { ICategoria, ISubcategoria } from '../types/categoria.type';
import { ICrearProductoContenido, ICreateProductoDTO, IProductoFilters, IProductos, IUpdateProductoDTO } from '../types/product.type';
import fs from 'fs';
import path from 'path';

export class ProductosService {

    async getAll(filters: IProductoFilters): Promise<IPaginatedResponse<IProductos>> {
        const {
            page = 1,
            limit = 100, // ⭐ Límite por defecto de 100 productos
            order_by = 'creado_en',
            order = 'desc',
            estado,
            busqueda,
            id_subcat,
            id_cat,
            id_marca,
            precio_min,
            precio_max,
            destacado,
            financiacion,
            stock_bajo
        } = filters;

        // Construir el where dinámicamente
        const whereClause: any = {};

        // ⭐ IMPORTANTE: Solo productos activos (excluir eliminados)
        // Si se proporciona estado explícitamente, usarlo; sino, solo activos
        if (estado !== undefined) {
            whereClause.estado = estado;
        } else {
            whereClause.estado = 1; // Por defecto, solo activos
        }

        if (destacado !== undefined) whereClause.destacado = destacado;
        if (financiacion !== undefined) whereClause.financiacion = financiacion;
        
        // Filtros usando códigos del CSV
        // Si id_marca es un número, buscar el código primero
        if (id_marca) {
            if (typeof id_marca === 'number') {
                const marca = await prisma.marca.findFirst({ where: { id_marca } });
                if (marca) {
                    whereClause.codi_marca = marca.codi_marca;
                }
            } else if (typeof id_marca === 'string') {
                whereClause.codi_marca = id_marca;
            }
        }

        // Si id_cat es un número, buscar el código primero
        if (id_cat) {
            if (typeof id_cat === 'number') {
                const categoria = await prisma.categoria.findFirst({ where: { id_cat } });
                if (categoria) {
                    whereClause.codi_categoria = categoria.codi_categoria;
                }
            } else if (typeof id_cat === 'string') {
                whereClause.codi_categoria = id_cat;
            }
        }

        // Filtro por grupo usando código
        if (filters.codi_grupo) {
            whereClause.codi_grupo = filters.codi_grupo;
        }

        // Filtro por IVA usando código
        if (filters.codi_impuesto) {
            if (typeof filters.codi_impuesto === 'number') {
                const iva = await prisma.iva.findFirst({ where: { id_iva: filters.codi_impuesto } });
                if (iva) {
                    whereClause.codi_impuesto = iva.codi_impuesto;
                }
            } else if (typeof filters.codi_impuesto === 'string') {
                whereClause.codi_impuesto = filters.codi_impuesto;
            }
        }

        // Filtro por rango de precio
        if (precio_min !== undefined || precio_max !== undefined) {
            whereClause.precio = {};
            if (precio_min !== undefined) whereClause.precio.gte = precio_min;
            if (precio_max !== undefined) whereClause.precio.lte = precio_max;
        }

        // Filtro por stock bajo - se aplicará después de obtener los resultados
        // porque necesitamos comparar Decimal (stock) con Int (stock_min)
        const aplicarFiltroStockBajo = stock_bajo === true;
        
        // Si se requiere filtro de stock bajo, agregamos condiciones básicas
        if (aplicarFiltroStockBajo) {
            whereClause.AND = [
                ...(whereClause.AND || []),
                { stock: { not: null } },
                { stock_min: { not: null } }
            ];
        }

        // Búsqueda por nombre, descripción, código de artículo, código de barras o SKU
        if (busqueda) {
            // Si ya existe un OR (por ejemplo, por el filtro de categoría), combinarlo
            const searchConditions = [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { descripcion: { contains: busqueda, mode: 'insensitive' } },
                { codi_arti: { contains: busqueda, mode: 'insensitive' } },
                { codi_barras: { contains: busqueda, mode: 'insensitive' } },
                { cod_sku: { contains: busqueda, mode: 'insensitive' } },
            ];

            if (whereClause.OR) {
                // Combinar búsqueda con OR existente usando AND
                whereClause.AND = [
                    ...(whereClause.AND || []),
                    {
                        OR: whereClause.OR
                    },
                    {
                        OR: searchConditions
                    }
                ];
                delete whereClause.OR;
            } else {
                whereClause.OR = searchConditions;
            }
        }

        // Ejecutar queries en paralelo
        const [productos, total] = await Promise.all([
            prisma.productos.findMany({
                where: whereClause,
                include: {
                    categoria: true,  // Relación por codi_categoria
                    marca: true,      // Relación por codi_marca
                    grupo: true,      // Relación por codi_grupo
                    iva: true        // Relación por codi_impuesto
                },
                orderBy: {
                    [order_by]: order
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.productos.count({ where: whereClause })
        ]);

        // Aplicar filtro de stock bajo en memoria si es necesario
        let productosFiltrados = productos as IProductos[];
        if (aplicarFiltroStockBajo) {
            productosFiltrados = productos.filter((producto) => {
                if (!producto.stock || !producto.stock_min) return false;
                return Number(producto.stock) <= Number(producto.stock_min);
            }) as IProductos[];
        }

        return {
            data: productosFiltrados,
            total: aplicarFiltroStockBajo ? productosFiltrados.length : total,
            page,
            limit,
            totalPages: aplicarFiltroStockBajo 
                ? Math.ceil(productosFiltrados.length / limit)
                : Math.ceil(total / limit),
        };
    }

    async getById(id: number): Promise<IProductos | null> {
        const producto = await prisma.productos.findFirst({
            where: { 
                id_prod: id,
                estado: 1 // ⭐ Solo productos activos
            },
            include: {
                categoria: true,  // Relación por codi_categoria
                marca: true,      // Relación por codi_marca
                grupo: true,      // Relación por codi_grupo
                iva: true        // Relación por codi_impuesto
            },
        });

        return producto as IProductos | null;
    }

    async getByCodigo(codi_arti: string): Promise<IProductos | null> {
        const producto = await prisma.productos.findUnique({
            where: { 
                codi_arti
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            },
        });

        if (!producto || producto.estado !== 1) {
            return null;
        }

        return producto as IProductos | null;
    }

    async create(data: ICreateProductoDTO): Promise<IProductos> {
        const { id_cat, id_subcat, id_marca, id_iva, codi_categoria, codi_marca, codi_grupo, codi_impuesto, ...cleanData } = data;

        const nuevoProducto = await prisma.productos.create({
            data: {
                ...cleanData,
                codi_categoria: codi_categoria || null,
                codi_marca: codi_marca || null,
                codi_grupo: codi_grupo || null,
                codi_impuesto: codi_impuesto || null,
                estado: 1,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            }
        });

        return nuevoProducto as IProductos;
    }

    async update(id: number, data: IUpdateProductoDTO): Promise<IProductos> {
        const { id_cat, id_subcat, id_marca, id_iva, codi_categoria, codi_marca, codi_grupo, codi_impuesto, estado, ...cleanData } = data;
        const productoActualizado = await prisma.productos.update({
            where: { id_prod: id },
            data: {
                ...cleanData,
                codi_categoria: codi_categoria !== undefined ? codi_categoria : undefined,
                codi_marca: codi_marca !== undefined ? codi_marca : undefined,
                codi_grupo: codi_grupo !== undefined ? codi_grupo : undefined,
                codi_impuesto: codi_impuesto !== undefined ? codi_impuesto : undefined,
                estado: estado ? Number(estado) : undefined,
                actualizado_en: new Date()
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            }
        });

        return productoActualizado as IProductos;
    }

    async delete(id: number): Promise<void> {
        // Soft delete: cambiar estado a 0
        await prisma.productos.update({
            where: { id_prod: id },
            data: {
                estado: 0,
                actualizado_en: new Date()
            }
        });
    }

    async exists(id: number): Promise<boolean> {
        const count = await prisma.productos.count({
            where: { 
                id_prod: id,
                estado: 1 // ⭐ Solo contar productos activos
            }
        });
        return count > 0;
    }

    async updateStock(id: number, cantidad: number): Promise<IProductos> {
        const producto = await prisma.productos.findFirst({
            where: { 
                id_prod: id,
                estado: 1 // ⭐ Solo productos activos
            }
        });

        if (!producto) {
            throw new Error('Producto no encontrado o inactivo');
        }

        // Convertir Decimal a número para la operación
        const stockActual = producto.stock ? Number(producto.stock) : 0;
        const nuevoStock = stockActual + cantidad;

        if (nuevoStock < 0) {
            throw new Error(`Stock insuficiente. Stock actual: ${stockActual}, intentando reducir: ${Math.abs(cantidad)}`);
        }

        return await this.update(id, { stock: nuevoStock });
    }

    async getDestacados(limit: number = 10): Promise<IProductos[]> {
        const productos = await prisma.productos.findMany({
            where: {
                destacado: true,
                estado: 1, // ⭐ Solo productos activos
                stock: {
                    gt: 0
                }
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            },
            take: limit,
            orderBy: {
                creado_en: 'desc'
            }
        });

        return productos as IProductos[];
    }

    async getStockBajo(): Promise<IProductos[]> {
        // Obtener todos los productos activos con stock y stock_min
        const productos = await prisma.productos.findMany({
            where: {
                estado: 1, // ⭐ Solo productos activos
                stock: { not: null },
                stock_min: { not: null }
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            },
            orderBy: {
                stock: 'asc'
            }
        });

        // Filtrar en memoria los que tienen stock <= stock_min
        const productosStockBajo = productos.filter((producto) => {
            if (!producto.stock || !producto.stock_min) return false;
            return Number(producto.stock) <= Number(producto.stock_min);
        });

        return productosStockBajo as IProductos[];
    }

    async getContenidoCrearProducto(): Promise<ICrearProductoContenido> {
        const [marcas, categorias, grupos, ivas] = await Promise.all([
            prisma.marca.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.categoria.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.grupo.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.iva.findMany({
                orderBy: { id_iva: 'asc' }
            })
        ]);

        return {
            marcas: marcas as IMarca[],
            categorias: categorias as ICategoria[],
            grupos: grupos as any[], // Agregar tipo IGrupo si es necesario
            ivas: ivas as IIva[]
        };
    }

    // Método removido - ya no hay subcategorías en el nuevo schema

    async toggleDestacado(id: number): Promise<IProductos> {
        const producto = await prisma.productos.findFirst({
            where: { 
                id_prod: id,
                estado: 1 // Solo productos activos pueden ser destacados
            }
        });

        if (!producto) {
            throw new Error('Producto no encontrado o inactivo');
        }

        const nuevoEstadoDestacado = !producto.destacado;

        const productoActualizado = await prisma.productos.update({
            where: { id_prod: id },
            data: {
                destacado: nuevoEstadoDestacado,
                actualizado_en: new Date()
            },
            include: {
                categoria: true,
                marca: true,
                grupo: true,
                iva: true
            }
        });

        return productoActualizado as IProductos;
    }

    /**
     * Obtiene productos que tienen imágenes en la carpeta resources/IMAGENES/img-art
     * Verifica si existe alguna imagen cuyo nombre comience con el codi_arti del producto
     */
    async getProductosConImagenes(filters?: IProductoFilters): Promise<IPaginatedResponse<IProductos>> {
        // Obtener la ruta del directorio de imágenes (relativa a src/)
        const imagenesDir = path.join(process.cwd(), 'src/resources/IMAGENES/img-art');

        // Leer todos los archivos en el directorio de imágenes
        let archivosImagenes: string[] = [];
        try {
            archivosImagenes = fs.readdirSync(imagenesDir);
        } catch (error) {
            console.error('Error al leer directorio de imágenes:', error);
            // Si no existe el directorio, devolver lista vacía
            return {
                data: [],
                total: 0,
                page: filters?.page || 1,
                limit: filters?.limit || 100,
                totalPages: 0
            };
        }

        // Extraer códigos únicos de productos (sin sufijos como -01, -02, etc.)
        const codigosConImagen = new Set<string>();
        archivosImagenes.forEach(archivo => {
            // Extraer el código del producto del nombre del archivo
            // Ejemplos: "620004-01.jpg" -> "620004", "617320.png" -> "617320"
            const match = archivo.match(/^(\d+)/);
            if (match) {
                codigosConImagen.add(match[1]);
            }
        });

        // Si no hay imágenes, devolver lista vacía
        if (codigosConImagen.size === 0) {
            return {
                data: [],
                total: 0,
                page: filters?.page || 1,
                limit: filters?.limit || 100,
                totalPages: 0
            };
        }

        // Construir filtros base
        const baseFilters: IProductoFilters = {
            ...filters,
            estado: filters?.estado !== undefined ? filters.estado : 1, // Solo activos por defecto
        };

        // Obtener todos los productos con los filtros aplicados
        const allProducts = await this.getAll({
            ...baseFilters,
            limit: 10000, // Obtener todos para filtrar por código
            page: 1
        });

        // Filtrar productos que tienen imágenes
        const productosConImagen = allProducts.data.filter(producto => 
            codigosConImagen.has(producto.codi_arti)
        );

        // Aplicar paginación manual
        const page = filters?.page || 1;
        const limit = filters?.limit || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const productosPaginados = productosConImagen.slice(startIndex, endIndex);

        return {
            data: productosPaginados,
            total: productosConImagen.length,
            page,
            limit,
            totalPages: Math.ceil(productosConImagen.length / limit)
        };
    }
}