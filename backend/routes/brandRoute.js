import express from 'express';
import {
  createBrand,
  deledBrand,
  getBrand,
  getallBrand,
  updatedBrand,
} from '../controllers/brandCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updatedBrand);
router.delete('/:id', authMiddleware, isAdmin, deledBrand);
router.get('/:id', authMiddleware, isAdmin, getBrand);
router.get('/', getallBrand);

export default router;
