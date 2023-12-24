import express from 'express';
import {
  createCategory,
  deledCategory,
  getallCategory,
  getCategory,
  updatedCategory,
} from '../controllers/blogcatCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updatedCategory);
router.delete('/:id', authMiddleware, isAdmin, deledCategory);
router.get('/:id', authMiddleware, isAdmin,getCategory);
router.get('/', getallCategory);

export default router;
