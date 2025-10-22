import { Router } from 'express';
import { CategoriasController } from '../controllers/categorias.controller';

const router = Router();
const categoriasController = new CategoriasController();

// ========================================
// RUTAS PARA CATEGORÍAS
// ========================================

router.get('/', categoriasController.getAllCategorias.bind(categoriasController));
router.get('/:id', categoriasController.getCategoriaById.bind(categoriasController));
router.post('/', categoriasController.createCategoria.bind(categoriasController));
router.put('/:id', categoriasController.updateCategoria.bind(categoriasController));
router.delete('/:id', categoriasController.deleteCategoria.bind(categoriasController));

// ========================================
// RUTAS PARA SUBCATEGORÍAS
// ========================================

// GET /api/categorias/subcategorias?id_cat=1 - Filtrar por categoría
router.get('/subcategorias/all', categoriasController.getAllSubcategorias.bind(categoriasController));
router.get('/subcategorias/:id', categoriasController.getSubcategoriaById.bind(categoriasController));
router.post('/subcategorias', categoriasController.createSubcategoria.bind(categoriasController));
router.put('/subcategorias/:id', categoriasController.updateSubcategoria.bind(categoriasController));
router.delete('/subcategorias/:id', categoriasController.deleteSubcategoria.bind(categoriasController));

export default router;