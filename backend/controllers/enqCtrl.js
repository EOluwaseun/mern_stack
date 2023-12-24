import expressAsyncHandler from 'express-async-handler';
import Enq from '../models/enqModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createEnq = expressAsyncHandler(async (req, res) => {
  try {
    const newEnq = await Enq.create(req.body);
    res.json(newEnq);
  } catch (error) {
    throw new Error(error);
  }
});

export const updatedEnq = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedEnq = await Enq.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnq);
  } catch (error) {
    throw new Error(error);
  }
});

export const deledEnq = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteEnq = await Enq.findByIdAndDelete(id);
    res.json(deleteEnq);
  } catch (error) {
    throw new Error(error);
  }
});

export const getEnq = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getEnq = await Enq.findById(id);
    res.json(getEnq);
  } catch (error) {
    throw new Error(error);
  }
});

export const getallEnq = expressAsyncHandler(async (req, res) => {
  try {
    const getallEnq = await Enq.find();
    res.json(getallEnq);
  } catch (error) {
    throw new Error(error);
  }
});
