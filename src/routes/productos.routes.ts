import { Router } from 'express';
import { ProductosController } from '../controllers/productos.controller';

const router = Router();
const productosController = new ProductosController();

router.get('/destacados', productosController.getDestacados.bind(productosController));
router.get('/stock-bajo', productosController.getStockBajo.bind(productosController));

router.get('/', productosController.getAll.bind(productosController));
router.get('/:id', productosController.getById.bind(productosController));

router.post('/', productosController.create.bind(productosController));
router.put('/:id', productosController.update.bind(productosController));
router.delete('/:id', productosController.delete.bind(productosController));
router.patch('/:id/stock', productosController.updateStock.bind(productosController));

export default router;