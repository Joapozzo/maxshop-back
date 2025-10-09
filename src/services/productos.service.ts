import { prisma } from '../index';
import { IProductos, IPaginatedResponse, IProductoFilters, ICreateProductoDTO, IUpdateProductoDTO } from '../types';

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
            destacado 
        } = filters;

        // Construir el where dinámicamente
        const whereClause: any = {};

        if (estado !== undefined) whereClause.estado = estado;
        if (destacado !== undefined) whereClause.destacado = destacado;
        if (id_subcat) whereClause.id_subcat = id_subcat;
        if (id_marca) whereClause.id_marca = id_marca;

        // Filtro por categoría (a través de subcategoría)
        if (id_cat) {
            whereClause.subcategoria = {
                id_cat: id_cat
            };
        }

        // Filtro por rango de precio
        if (precio_min !== undefined || precio_max !== undefined) {
            whereClause.precio = {};
            if (precio_min !== undefined) whereClause.precio.gte = precio_min;
            if (precio_max !== undefined) whereClause.precio.lte = precio_max;
        }

        // Búsqueda por nombre, descripción o SKU
        if (busqueda) {
            whereClause.OR = [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { desc: { contains: busqueda, mode: 'insensitive' } },
                { cod_sku: { contains: busqueda, mode: 'insensitive' } },
            ];
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
            where: { id_prod: id },
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
        const nuevoProducto = await prisma.productos.create({
            data: {
                ...data,
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
        const productoActualizado = await prisma.productos.update({
            where: { id_prod: id },
            data: {
                ...data,
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
            where: { id_prod: id }
        });
        return count > 0;
    }

    async updateStock(id: number, cantidad: number): Promise<IProductos> {
        const producto = await this.getById(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        const nuevoStock = (producto.stock || 0) + cantidad;

        return await this.update(id, { stock: nuevoStock });
    }

    async getDestacados(limit: number = 10): Promise<IProductos[]> {
        const productos = await prisma.productos.findMany({
            where: {
                destacado: true,
                estado: 1,
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
                estado: 1,
                stock: {
                    lte: prisma.productos.fields.stock_min
                }
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
}