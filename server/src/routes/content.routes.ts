import { Router } from 'express';
import { 
  createContent, 
  getContent, 
  updateContent, 
  deleteContent, 
  listContent 
} from '../controllers/content.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', listContent);
router.get('/:id', getContent);

// Protected routes (require authentication)
router.use(auth);
router.post('/', createContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

export default router;
