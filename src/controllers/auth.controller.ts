import '../types/express';
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async loginWithFirebaseToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.loginWithFirebaseToken({
        ...req.body,
        ip: req.ip ?? null,
        userAgent: req.headers['user-agent']?.toString() ?? null,
        endpoint: req.originalUrl ?? null
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  async registerWithFirebase(req: Request, res: Response): Promise<void> {
    try {
      const uid = req.body.data.uid;
      const result = await authService.registerWithFirebase({
        ...req.body,
        ip: req.ip ?? null,
        userAgent: req.headers['user-agent']?.toString() ?? null,
        endpoint: req.originalUrl ?? null
      });

      res.status(result.created ? 201 : 200).json({
        success: true,
        data: result,
        message: result.created ? 'Usuario registrado exitosamente' : 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  async completeProfile(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.completeProfile({
        ...req.body,
        ip: req.ip ?? null,
        userAgent: req.headers['user-agent']?.toString() ?? null,
        endpoint: req.originalUrl ?? null
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Perfil completado exitosamente'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al completar el perfil';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: {
        user: req.authenticatedUser ?? null,
        needsTokenRefresh: req.needsTokenRefresh ?? false
      }
    });
  }
}

export const authController = new AuthController();

