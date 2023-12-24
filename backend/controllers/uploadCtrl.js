// import { validateMongodbId } from '../utils/validateMongodb.js';
import expressAsyncHandler from 'express-async-handler';
import { cloudinaryDelete, cloudinaryUpload } from '../utils/cloudinary..js';
import fs from 'fs';

export const uploadImages = expressAsyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUpload(path, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      // console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
    // console.log(images);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteImages = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = (path) => cloudinaryDelete(id, 'images');

    res.json({ message: 'Deleted' });
  } catch (error) {
    throw new Error(error);
  }
});
