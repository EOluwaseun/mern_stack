import express from 'express';
import {
  createCoupon,
  deleteCoupons,
  getCoupon,
  getallCoupons,
  updateCoupons,
} from '../controllers/couponCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getallCoupons);
router.get('/:id', authMiddleware, isAdmin, getCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupons);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupons);

export default router;
