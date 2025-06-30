import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', auth, getCurrentUser);

export default router;
