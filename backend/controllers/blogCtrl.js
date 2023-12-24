import expressAsyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';
import { validateMongodbId } from '../utils/validateMongodb.js';

export const createBlog = expressAsyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      //   status: 'success',
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update blog
export const updateBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get a blog
export const getBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const getBlog = await Blog.findById(id)
      .populate('likes')
      .populate('dislikes');
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numviews: 1 }, //increase number of views to 1
      },
      {
        new: true,
      }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get all blogs
export const getAllBlogs = expressAsyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

// delete blog
export const deleteBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//liked functionality
export const likeBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body; //get d id from d body
  validateMongodbId(blogId);
  const blog = await Blog.findById(blogId); //get d blog by id
  const loginUserId = req?.user?._id; // get d login user _id
  // console.log(loginUserId);
  const isLiked = blog?.isLiked;
  //check if post has already been disliked, find d user ID
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    // if already disliked and i disliked again remove d id from d disliked array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId }, // remove d userId from d disliked array
        isDisliked: false, // then set disliked to false
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId }, // if it has lready been liked, then you click again, it will be pulled out
        isLiked: false, // set disliked to false
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId }, // push d user id into d likes array
        isLiked: true, // set the liked to true
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//liked functionality---
export const disLikedBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body; //get d id from d body the blog ID
  validateMongodbId(blogId);
  const blog = await Blog.findById(blogId); //get d blog by id
  const loginUserId = req?.user?._id; // get d login user _id the user ID
  // console.log(loginUserId);
  const isDisliked = blog?.isDisliked; // get d dislike array

  //check if i have already liked d post before disliking it, find d user ID from the people that have likes d post
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    // if already disliked and i disliked again remove d id from d disliked array
    // So by the time i clicked, it will show dat i have already liked the post initially
    //then it will have to pull my ID from d people that have likes d post and set my like to false
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isliked: false, // then set disliked to false
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }

  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId }, // if i have already dislike d post and i dislike again, my ID will be removed from d people dat disliked d post
        isDisliked: false, // set disliked to false
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId }, // otherwise my ID will be push to d people dat have like d post
        isDisliked: true, // set the liked to true
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});
