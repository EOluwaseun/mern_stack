import expressAsyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

export const updatedBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

export const deledBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});

export const getBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBrand = await Brand.findById(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});

export const getallBrand = expressAsyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});
