import express from 'express';
import {
  createEnq,
  deledEnq,
  getallEnq,
  updatedEnq,
  getEnq,
} from '../controllers/enqCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createEnq);
router.put('/:id', authMiddleware, isAdmin, updatedEnq);
router.delete('/:id', authMiddleware, isAdmin, deledEnq);
router.get('/:id', getEnq);
router.get('/', getallEnq);

export default router;
