// src/middlewares/validarProducto.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

/**
 * Middleware para validar que un producto existe, está activo y cumple condiciones
 */
export const validarProductoActivo = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID de producto inválido'
            });
            return;
        }

        const producto = await prisma.productos.findFirst({
            where: { id_prod: id }
        });

        // Validar existencia
        if (!producto) {
            console.error(`❌ [Validación] Producto ID ${id} no encontrado`);
            res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
            return;
        }

        // Validar estado activo
        if (producto.estado === 0) {
            console.error(`❌ [Validación] Producto ID ${id} está eliminado (soft delete)`);
            res.status(400).json({
                success: false,
                error: 'No se puede operar sobre un producto eliminado'
            });
            return;
        }

        if (producto.estado !== 1) {
            console.error(`❌ [Validación] Producto ID ${id} está inactivo (estado: ${producto.estado})`);
            res.status(400).json({
                success: false,
                error: 'El producto no está activo'
            });
            return;
        }

        console.log(`✅ [Validación] Producto ID ${id} validado correctamente`);
        
        // Adjuntar producto al request para uso posterior
        (req as any).producto = producto;
        
        next();
    } catch (error) {
        console.error('❌ [Validación] Error en validarProductoActivo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al validar producto'
        });
    }
};

/**
 * Middleware para validar que un producto tiene stock disponible
 */
export const validarStockDisponible = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const producto = (req as any).producto;

        if (!producto) {
            res.status(500).json({
                success: false,
                error: 'Error: producto no encontrado en el contexto'
            });
            return;
        }

        const stockActual = producto.stock || 0;

        if (stockActual <= 0) {
            console.error(`❌ [Validación] Producto "${producto.nombre}" sin stock (stock: ${stockActual})`);
            res.status(400).json({
                success: false,
                error: `El producto "${producto.nombre}" no tiene stock disponible (stock actual: ${stockActual})`
            });
            return;
        }

        console.log(`✅ [Validación] Producto "${producto.nombre}" tiene stock: ${stockActual}`);
        next();
    } catch (error) {
        console.error('❌ [Validación] Error en validarStockDisponible:', error);
        res.status(500).json({
            success: false,
            error: 'Error al validar stock'
        });
    }
};

/**
 * Middleware para validar que las relaciones del producto son válidas
 * (marca, subcategoría, IVA)
 */
export const validarRelacionesProducto = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const { id_marca, id_subcat, id_iva } = req.body;

        // Validar marca si se proporciona
        if (id_marca) {
            const marca = await prisma.marca.findFirst({
                where: { id_marca }
            });

            if (!marca) {
                console.error(`❌ [Validación] Marca ID ${id_marca} no encontrada`);
                res.status(400).json({
                    success: false,
                    error: `La marca especificada (ID: ${id_marca}) no existe`
                });
                return;
            }
        }

        // Validar subcategoría si se proporciona
        if (id_subcat) {
            const subcategoria = await prisma.subcategoria.findFirst({
                where: { id_subcat }
            });

            if (!subcategoria) {
                console.error(`❌ [Validación] Subcategoría ID ${id_subcat} no encontrada`);
                res.status(400).json({
                    success: false,
                    error: `La subcategoría especificada (ID: ${id_subcat}) no existe`
                });
                return;
            }
        }

        // Validar IVA si se proporciona
        if (id_iva) {
            const iva = await prisma.iva.findFirst({
                where: { id_iva }
            });

            if (!iva) {
                console.error(`❌ [Validación] IVA ID ${id_iva} no encontrado`);
                res.status(400).json({
                    success: false,
                    error: `El tipo de IVA especificado (ID: ${id_iva}) no existe`
                });
                return;
            }
        }

        console.log('✅ [Validación] Relaciones del producto validadas correctamente');
        next();
    } catch (error) {
        console.error('❌ [Validación] Error en validarRelacionesProducto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al validar relaciones del producto'
        });
    }
};