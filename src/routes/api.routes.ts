import { Router } from 'express';
import productosRoutes from './productos.routes';

const apiRoutes = Router();

apiRoutes.use('/products', productosRoutes);
// apiRoutes.use('/users', require('./users.routes'));
// apiRoutes.use('/ventas', require('./ventas.routes'));

export default apiRoutes;