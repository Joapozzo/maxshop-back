// src/routes/api.routes.ts
import { Router } from 'express';
import productosRoutes from './productos.routes';
import marcasRoutes from './marcas.routes';
import categoriasRoutes from './categorias.routes';

const apiRoutes = Router();

// Rutas de productos (incluye endpoint para obtener datos del formulario)
apiRoutes.use('/products', productosRoutes);

// Rutas de marcas
apiRoutes.use('/marcas', marcasRoutes);

// Rutas de categorías y subcategorías
apiRoutes.use('/categorias', categoriasRoutes);

// Otras rutas futuras
// apiRoutes.use('/users', require('./users.routes'));
// apiRoutes.use('/ventas', require('./ventas.routes'));

export default apiRoutes;