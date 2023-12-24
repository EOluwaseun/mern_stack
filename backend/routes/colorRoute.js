import express from 'express';
import {
  createColor,
  deledColor,
  getColor,
  getallColor,
  updatedColor,
} from '../controllers/colorCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createColor);
router.put('/:id', authMiddleware, isAdmin, updatedColor);
router.delete('/:id', authMiddleware, isAdmin, deledColor);
router.get('/:id', getColor);
router.get('/', getallColor);

export default router;
