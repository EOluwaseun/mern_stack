import expressAsyncHandler from 'express-async-handler';
import Color from '../models/colorModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createColor = expressAsyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

export const updatedColor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

export const deledColor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id);
    res.json(deleteColor);
  } catch (error) {
    throw new Error(error);
  }
});

export const getColor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getColor = await Color.findById(id);
    res.json(getColor);
  } catch (error) {
    throw new Error(error);
  }
});

export const getallColor = expressAsyncHandler(async (req, res) => {
  try {
    const getallColor = await Color.find();
    res.json(getallColor);
  } catch (error) {
    throw new Error(error);
  }
});
