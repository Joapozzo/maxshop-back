import { prisma } from '../index';
import { IIva, IPaginatedResponse, IMarca } from '../types';
import { ICategoria, ISubcategoria } from '../types/categoria.type';
import { ICrearProductoContenido, ICreateProductoDTO, IProductoFilters, IProductos, IUpdateProductoDTO } from '../types/product.type';

export class ProductosService {

    async getAll(filters: IProductoFilters): Promise<IPaginatedResponse<IProductos>> {
        const {
            page = 1,
            limit = 10,
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
        if (id_subcat) whereClause.id_subcat = id_subcat;
        if (id_marca) whereClause.id_marca = id_marca;

        // ✅ FIX: Filtro por categoría - buscar tanto en id_cat directo como en subcategoria
        if (id_cat) {
            whereClause.OR = [
                // Productos que tienen id_cat directamente
                { id_cat: id_cat },
                // Productos que tienen subcategoría de esta categoría
                {
                    subcategoria: {
                        id_cat: id_cat
                    }
                }
            ];
        }

        // Filtro por rango de precio
        if (precio_min !== undefined || precio_max !== undefined) {
            whereClause.precio = {};
            if (precio_min !== undefined) whereClause.precio.gte = precio_min;
            if (precio_max !== undefined) whereClause.precio.lte = precio_max;
        }

        // Filtro por stock bajo
        if (stock_bajo) {
            whereClause.AND = [
                { stock: { not: null } },
                { stock_min: { not: null } },
                { stock: { lte: prisma.productos.fields.stock_min } }
            ];
        }

        // Búsqueda por nombre, descripción o SKU
        if (busqueda) {
            // Si ya existe un OR (por ejemplo, por el filtro de categoría), combinarlo
            const searchConditions = [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { descripcion: { contains: busqueda, mode: 'insensitive' } },
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
                    subcategoria: {
                        include: {
                            categoria: true
                        }
                    },
                    marca: true,
                    iva: true
                },
                orderBy: {
                    [order_by]: order
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.productos.count({ where: whereClause })
        ]);

        return {
            data: productos as IProductos[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getById(id: number): Promise<IProductos | null> {
        const producto = await prisma.productos.findFirst({
            where: { 
                id_prod: id,
                estado: 1 // ⭐ Solo productos activos
            },
            include: {
                subcategoria: {
                    include: {
                        categoria: true
                    }
                },
                marca: true,
                iva: true,
            },
        });

        return producto as IProductos | null;
    }

    async create(data: ICreateProductoDTO): Promise<IProductos> {
        const { id_cat, id_subcat, id_marca, id_iva, ...cleanData } = data;

        const nuevoProducto = await prisma.productos.create({
            data: {
                ...cleanData,
                id_subcat: id_subcat ? Number(id_subcat) : null,
                id_marca: id_marca ? Number(id_marca) : null,
                id_iva: id_iva ? Number(id_iva) : null,
                estado: 1,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            include: {
                subcategoria: {
                    include: {
                        categoria: true
                    }
                },

                marca: true,
                iva: true
            }
        });

        return nuevoProducto as IProductos;
    }

    async update(id: number, data: IUpdateProductoDTO): Promise<IProductos> {
        const { id_cat, id_subcat, id_marca, id_iva, estado, ...cleanData } = data;
        const productoActualizado = await prisma.productos.update({
            where: { id_prod: id },
            data: {
                ...cleanData,
                id_subcat: id_subcat ? Number(id_subcat) : null,
                id_marca: id_marca ? Number(id_marca) : null,
                id_cat: id_cat ? Number(id_cat) : null,
                id_iva: id_iva ? Number(id_iva) : null,
                estado: estado ? Number(estado) : null,
                actualizado_en: new Date()
            },
            include: {
                subcategoria: {
                    include: {
                        categoria: true
                    }
                },
                marca: true,
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

        const nuevoStock = (producto.stock || 0) + cantidad;

        if (nuevoStock < 0) {
            throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}, intentando reducir: ${Math.abs(cantidad)}`);
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
                subcategoria: {
                    include: {
                        categoria: true
                    }
                },
                marca: true,
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
        const productos = await prisma.productos.findMany({
            where: {
                estado: 1, // ⭐ Solo productos activos
                OR: [
                    {
                        AND: [
                            { stock: { not: null } },
                            { stock_min: { not: null } },
                            { stock: { lte: prisma.productos.fields.stock_min } }
                        ]
                    }
                ]
            },
            include: {
                subcategoria: true,
                marca: true
            },
            orderBy: {
                stock: 'asc'
            }
        });

        return productos as IProductos[];
    }

    async getContenidoCrearProducto(): Promise<ICrearProductoContenido> {
        const [marcas, categorias, subcategorias, ivas] = await Promise.all([
            prisma.marca.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.categoria.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.subcategoria.findMany({
                include: {
                    categoria: true
                },
                orderBy: { nombre: 'asc' }
            }),
            prisma.iva.findMany({
                orderBy: { id_iva: 'asc' }
            })
        ]);

        return {
            marcas: marcas as IMarca[],
            categorias: categorias as ICategoria[],
            subcategorias: subcategorias as ISubcategoria[],
            ivas: ivas as IIva[]
        };
    }

    async getSubcategoriasPorCategoria(id_cat: number): Promise<ISubcategoria[]> {
        const subcategorias = await prisma.subcategoria.findMany({
            where: { id_cat: id_cat },
            include: {
                categoria: true
            },
            orderBy: { nombre: 'asc' }
        });

        return subcategorias as ISubcategoria[];
    }

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
                subcategoria: {
                    include: {
                        categoria: true
                    }
                },
                marca: true,
                iva: true
            }
        });

        return productoActualizado as IProductos;
    }
}