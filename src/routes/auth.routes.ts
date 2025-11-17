import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import {
  setSecurityHeaders,
  verifyFirebaseToken
} from '../middlewares/auth.middleware';

const authRoutes = Router();

authRoutes.use(setSecurityHeaders);

authRoutes.post('/login/token', (req, res) => authController.loginWithFirebaseToken(req, res));
authRoutes.post('/register', verifyFirebaseToken, (req, res) => authController.registerWithFirebase(req, res));
authRoutes.post('/complete-profile', verifyFirebaseToken, (req, res) => authController.completeProfile(req, res));
authRoutes.get('/me', verifyFirebaseToken, (req, res) => authController.getCurrentUser(req, res));

export default authRoutes;

