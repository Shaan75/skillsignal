import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export interface AuthRequest extends Request {
  user?: any
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Not authorized' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' })
  }
}