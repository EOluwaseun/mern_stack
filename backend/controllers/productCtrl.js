import expressAsyncHandler from 'express-async-handler';
import slugify from 'slugify';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

export const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// product update
export const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// product delete
export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id, req.body, {
      new: true,
    });
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// get single product
export const getaProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params; //getting id from the url
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// get all product
export const getAllProduct = expressAsyncHandler(async (req, res) => {
  //   console.log(req.query);
  try {
    // destructure query object
    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields']; // fields we need to exclude
    //deleting d query object
    excludeFields.forEach((el) => delete queryObject[el]); //we delete all d fields if its available in query
    console.log(queryObject, req.query); //original query and modified query

    let queryString = JSON.stringify(queryObject); //stringify d modified string
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); //g merges it all

    // console.log(JSON.parse(queryString));
    // const getAllProducts = await Product.find(queryObject); //this will filter all
    let query = Product.find(JSON.parse(queryString));

    // different ways to filter product
    // const getAllProducts = await Product.where('category').equals(
    //     req.query.category
    //   );
    // const getAllProducts = await Product.find(req.query);
    // brand:req.query.brand filter by brand
    // category:req.query.category filter by category

    //SORTING
    if (req.query.sort) {
      // category,brand this is spliited with comma then join it
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // sortBy is the query
    } else {
      query = query.sort('');
    }

    //FIELDS
    if (req.query.fields) {
      // category,brand this is spliited with comma then join it
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // sortBy is the query
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exist');
    }
    // console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//wishlist
export const addToWishList = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body; //destructure id from d body
  try {
    const user = await User.findById(_id); //await bcos it is coming from backend
    const alreadyAdded = user.whishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { whishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { whishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//rating
export const rating = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    ); // posted by d user
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        //
        {
          ratings: { $elemMatch: alreadyRated }, // this will match already rated
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment }, // set ratings
        },
        {
          new: true,
        }
      );
      // res.json(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      // res.json(rateProduct);
      // sum all ratings
      const getallratings = await Product.findById(prodId);
      let totalRating = getallratings.ratings.length;
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
      let finalProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          totalsrating: actualRating,
        },
        {
          new: true,
        }
      );
      res.json(finalProduct);
    }
  } catch (error) {
    throw new Error(error);
  }
});
