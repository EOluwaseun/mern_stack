import express from 'express';
import {
  addToWishList,
  createProduct,
  deleteProduct,
  getAllProduct,
  getaProduct,
  rating,
  updateProduct,
} from '../controllers/productCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);

router.get('/:id', getaProduct);
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);

router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct); //check is admin, then check if it is authenticated user

router.get('/', getAllProduct);

export default router;
