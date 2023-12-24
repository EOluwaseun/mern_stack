import express from 'express';
import {
  applyCoupon,
  blockUser,
  createOrder,
  createUser,
  deleteUser,
  emptyCart,
  forgotPasswordToken,
  getAllOrders,
  getAllUser,
  getOrderByUserId,
  getOrders,
  getUser,
  getUserCart,
  getWishList,
  handleRefreshToken,
  loginAdmin,
  loginCtrl,
  logoutCtrl,
  resetPassword,
  saveAddress,
  unblockUser,
  updateOrderStatus,
  updatePassword,
  updateUser,
  userCart,
} from '../controllers/userCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword); // token as reference
router.put('/update-order/:id', authMiddleware, isAdmin, updateOrderStatus); // token as reference

router.put('/password', authMiddleware, updatePassword); // without bei authenticate we can d _id
router.post('/login', loginCtrl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get('/all-users', getAllUser);
router.get('/get-orders', authMiddleware, getOrders);
router.get('/get-allorders', authMiddleware, isAdmin, getAllOrders);
router.post('/getorderbyuser/:id', authMiddleware, isAdmin, getOrderByUserId);
router.get('/refresh', handleRefreshToken); // why is refreshtoke here?
router.get('/wishlist', authMiddleware, getWishList);
router.get('/cart', authMiddleware, getUserCart);
router.get('/logout', logoutCtrl);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteUser);

router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

export default router;
