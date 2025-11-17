import { prisma } from '../index';
import { type AuditLogPayload } from '../types/auth.type';

class AuditService {
  private toJsonSafe(data?: unknown) {
    if (!data) {
      return undefined;
    }

    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error('No se pudo serializar la data para auditoría:', error);
      return undefined;
    }
  }

  async record(payload: AuditLogPayload) {
    try {
      await prisma.auditoria.create({
        data: {
          id_usuario: payload.userId ?? null,
          accion: payload.action,
          tabla_afectada: payload.table ?? 'usuarios',
          descripcion: payload.description ?? null,
          dato_anterior: this.toJsonSafe(payload.previousData),
          dato_despues: this.toJsonSafe(payload.currentData),
          user_agent: payload.userAgent ?? null,
          endpoint: payload.endpoint ?? null,
          estado: payload.status ?? 'SUCCESS',
          tiempo_procesamiento: payload.processingTimeMs
            ? Math.round(payload.processingTimeMs)
            : null
        }
      });
    } catch (error) {
      console.error('No se pudo registrar la auditoría:', error);
    }
  }
}

export const auditService = new AuditService();

