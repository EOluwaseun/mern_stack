import expressAsyncHandler from 'express-async-handler';
import Category from '../models/categoriesModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const updatedCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const deledCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getCategory = await Category.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getallCategory = expressAsyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
