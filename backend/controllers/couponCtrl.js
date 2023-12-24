import expressAsyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
export const getallCoupons = expressAsyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.find();
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
export const getCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getACoupon = await Coupon.findById(id);
    res.json(getACoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCoupons = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCoupons = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
