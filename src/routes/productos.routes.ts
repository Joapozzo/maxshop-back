// src/routes/productos.routes.ts
import { Router } from 'express';
import { ProductosController } from '../controllers/productos.controller';
import { 
    validarProductoActivo, 
    validarStockDisponible, 
    validarRelacionesProducto 
} from '../middlewares/validarProducto.middleware';

const router = Router();
const productosController = new ProductosController();

// ⚠️ IMPORTANTE: Las rutas específicas ANTES de las rutas con parámetros

// Rutas para obtener datos del formulario (sin middleware)
router.get('/contenido-crear', productosController.getContenidoCrearProducto.bind(productosController));
router.get('/subcategorias/:id_cat', productosController.getSubcategoriasPorCategoria.bind(productosController));

// Rutas especiales (sin middleware de validación individual)
router.get('/destacados', productosController.getDestacados.bind(productosController));
router.get('/stock-bajo', productosController.getStockBajo.bind(productosController));

// Rutas CRUD generales
router.get('/', productosController.getAll.bind(productosController));

// GET por ID: validar que el producto esté activo
router.get('/:id', 
    validarProductoActivo,
    productosController.getById.bind(productosController)
);

// POST crear: validar relaciones (marca, subcategoría, IVA)
router.post('/', 
    validarRelacionesProducto,
    productosController.create.bind(productosController)
);

// PUT actualizar: validar que el producto esté activo y relaciones
router.put('/:id', 
    validarProductoActivo,
    validarRelacionesProducto,
    productosController.update.bind(productosController)
);

// DELETE: validar que el producto esté activo antes de hacer soft delete
router.delete('/:id', 
    validarProductoActivo,
    productosController.delete.bind(productosController)
);

// PATCH stock: validar que el producto esté activo
router.patch('/:id/stock', 
    validarProductoActivo,
    productosController.updateStock.bind(productosController)
);

// ⭐ NUEVO: Toggle destacado
// PATCH /api/products/:id/destacado
router.patch('/:id/destacado', 
    validarProductoActivo,
    productosController.toggleDestacado.bind(productosController)
);

export default router;