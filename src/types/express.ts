import type { DecodedIdToken } from 'firebase-admin/auth';
import type { AuthenticatedUser } from './auth.type';

declare module 'express-serve-static-core' {
  interface Request {
    decodedToken?: DecodedIdToken;
    authenticatedUser?: AuthenticatedUser | null;
    needsTokenRefresh?: boolean;
  }
}

