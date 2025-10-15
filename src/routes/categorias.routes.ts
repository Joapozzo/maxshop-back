// src/routes/categorias.routes.ts
import { Router } from 'express';
import { CategoriasController } from '../controllers/categorias.controller';

const router = Router();
const categoriasController = new CategoriasController();

// ========================================
// RUTAS PARA CATEGORÍAS
// ========================================

// GET /api/categorias - Obtener todas las categorías
router.get('/', categoriasController.getAllCategorias.bind(categoriasController));

// GET /api/categorias/:id - Obtener una categoría por ID
router.get('/:id', categoriasController.getCategoriaById.bind(categoriasController));

// POST /api/categorias - Crear nueva categoría
router.post('/', categoriasController.createCategoria.bind(categoriasController));

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', categoriasController.updateCategoria.bind(categoriasController));

// DELETE /api/categorias/:id - Eliminar categoría (solo si no tiene subcategorías)
router.delete('/:id', categoriasController.deleteCategoria.bind(categoriasController));

// ========================================
// RUTAS PARA SUBCATEGORÍAS
// ========================================

// GET /api/categorias/subcategorias - Obtener todas las subcategorías
// GET /api/categorias/subcategorias?id_cat=1 - Filtrar por categoría
router.get('/subcategorias/all', categoriasController.getAllSubcategorias.bind(categoriasController));

// GET /api/categorias/subcategorias/:id - Obtener una subcategoría por ID
router.get('/subcategorias/:id', categoriasController.getSubcategoriaById.bind(categoriasController));

// POST /api/categorias/subcategorias - Crear nueva subcategoría
router.post('/subcategorias', categoriasController.createSubcategoria.bind(categoriasController));

// PUT /api/categorias/subcategorias/:id - Actualizar subcategoría
router.put('/subcategorias/:id', categoriasController.updateSubcategoria.bind(categoriasController));

// DELETE /api/categorias/subcategorias/:id - Eliminar subcategoría
router.delete('/subcategorias/:id', categoriasController.deleteSubcategoria.bind(categoriasController));

export default router;