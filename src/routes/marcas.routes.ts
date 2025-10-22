// src/routes/marcas.routes.ts
import { Router } from 'express';
import { MarcasController } from '../controllers/marcas.controller';

const router = Router();
const marcasController = new MarcasController();

// GET /api/marcas - Obtener todas las marcas
router.get('/', marcasController.getAll.bind(marcasController));

// GET /api/marcas/:id - Obtener una marca por ID
router.get('/:id', marcasController.getById.bind(marcasController));

// POST /api/marcas - Crear nueva marca
router.post('/', marcasController.create.bind(marcasController));

// PUT /api/marcas/:id - Actualizar marca
router.put('/:id', marcasController.update.bind(marcasController));

// DELETE /api/marcas/:id - Eliminar marca (solo si no tiene productos)
router.delete('/:id', marcasController.delete.bind(marcasController));

export default router;