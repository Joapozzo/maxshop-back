import { Router } from 'express';
import productosRoutes from './productos.routes';
import marcasRoutes from './marcas.routes';
import categoriasRoutes from './categorias.routes';
import authRoutes from './auth.routes';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/productos', productosRoutes);
apiRoutes.use('/marcas', marcasRoutes);
apiRoutes.use('/categorias', categoriasRoutes);


export default apiRoutes;   