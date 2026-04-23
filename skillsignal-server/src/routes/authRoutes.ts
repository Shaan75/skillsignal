import { Router } from 'express'
import { register, login } from '../controllers/authController'
import { protect } from '../middleware/authMiddleware'
import { AuthRequest } from '../middleware/authMiddleware'
import { Response } from 'express'

const router = Router()

router.post('/register', register)
router.post('/login', login)

// Protected: get current user
router.get('/me', protect, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

export default router