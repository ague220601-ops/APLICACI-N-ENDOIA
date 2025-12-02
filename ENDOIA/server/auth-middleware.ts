import type { Request, Response, NextFunction } from 'express';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'endoia',
  });
}

const ROLE_BY_EMAIL: Record<string, string> = {
  'jennifer.endoia@gmail.com': 'tutor',
  'segura.endoia@gmail.com': 'tutor',
  'ague220601@gmail.com': 'tutor',
  'investigador.endoia@gmail.com': 'investigador',
  'ague2206@gmail.com': 'investigador',
};

const EMAIL_TO_TOKEN: Record<string, string> = {
  'jennifer.endoia@gmail.com': 'JEN_MARTIN_2025',
  'segura.endoia@gmail.com': 'SEGURA_2025',
  'ague220601@gmail.com': 'JEN_MARTIN_2025',
  'investigador.endoia@gmail.com': 'INVESTIGADOR_2025',
  'ague2206@gmail.com': 'INVESTIGADOR_2025',
};

export interface AuthenticatedRequest extends Request {
  userEmail?: string;
  userRole?: string;
  n8nToken?: string;
}

export async function validateFirebaseToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: falta token' });
    }

    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await getAuth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      return res.status(401).json({ error: 'Token no contiene email' });
    }

    req.userEmail = email.toLowerCase();
    req.userRole = ROLE_BY_EMAIL[req.userEmail] || 'clinico';
    req.n8nToken = EMAIL_TO_TOKEN[req.userEmail] || '';

    next();
  } catch (error) {
    console.error('Error validando token Firebase:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }

    next();
  };
}
