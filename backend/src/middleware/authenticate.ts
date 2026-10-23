import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import prisma from '../prisma';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; phoneNumber: string };
}

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return _res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { id: string; phoneNumber: string };
    req.user = { id: payload.id, phoneNumber: payload.phoneNumber };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return _res.status(401).json({ message: 'Invalid or expired token' });
  }
};
