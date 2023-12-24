import express from 'express';
import { deleteImages, uploadImages } from '../controllers/uploadCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
  uploadPhoto,
  productImgResize,
} from '../middlewares/imageUploadMiddleWare.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgResize,
  uploadImages
);

router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages); //check is admin, then check if it is authenticated user

export default router;
