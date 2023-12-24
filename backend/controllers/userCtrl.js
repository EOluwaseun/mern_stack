import { generateToken } from '../config/jwtToken.js';
import crypto from 'crypto';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { validateMongodbId } from '../utils/validateMongodb.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from './email.js';
import Cart from '../models/cartModel.js';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';
import uniqid from 'uniqid';

export const createUser = expressAsyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // user already exist
    throw new Error('User already exist');
  }
});

// login controller
export const loginCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  // check user
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, //save into d cookie
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid credentials');
  }
});

export const handleRefreshToken = expressAsyncHandler(
  async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      throw new Error('No refresh token in cookies');
    }
    // otherwise
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken }); // find user base on refreshToken
    if (!user) {
      throw new Error('No Refresh Token present in db');
    }
    // otherwise
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error('There is something wrong with refresh token');
      }
      const accessToken = generateToken(user._id); //this generate new token
      res.json({ accessToken });
    });
  }
);

// admin
export const loginAdmin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findAdmin = await User.findOne({ email });
  // check admin
  if (findAdmin.role !== 'admin') throw new Error('Not Authorized');
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, //save into d cookie
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error('Invalid credentials');
  }
});

// logout
export const logoutCtrl = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error('No Refresh in Cookie');
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate({
    refreshToken: '',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

// update user
export const updateUser = expressAsyncHandler(async (req, res) => {
  // const { id } = req.params;
  const { _id } = req.user; // getting id from mongodb
  validateMongodbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

export const saveAddress = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address, //just add dress to the user details
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
export const getAllUser = expressAsyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch {
    throw new Error(error);
  }
});
// get a single user
export const getUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  // console.log(id);
  try {
    const getUser = await User.findById(id);
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete a user
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  // console.log(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: 'User Blocked' });
  } catch (error) {
    throw new Error(error);
  }
});

export const unblockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id); // validate d id from mongodb

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: 'User UnBlocked' });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
export const updatePassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user; // req.user got from authMiddleware
  const { password } = req.body; // destructure password from body
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

export const forgotPasswordToken = expressAsyncHandler(async (req, res) => {
  //email is needed to generate token,
  const { email } = req.body; // get d email from d body
  const user = await User.findOne({ email }); //find d user with dis email
  if (!user) throw new Error('User not found with this email');
  // if d user is found
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi follow this link to reset password, This Link is valid for 10 minutes from now. <a href="http://localhost:5000/user/reset-password/${token}">Click here</a>`;
    // forgot password route is password in d href
    // create data object
    const data = {
      to: email, // this is person log in
      text: 'Hey User',
      subject: 'Forgot Password Link',
      htm: resetURL,
    };
    // import sendEmail and pass d data
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { password } = req.body; //destructure password from body
  const { token } = req.params; // destructure token from body
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {
      $gt: Date.now(), // if token validation is more than 10min
    },
  });
  if (!user) throw new Error('Token Expired, Please try again later');
  //  otherwise reset passeword
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// this will get user whislist
export const getWishList = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  // validateMongodbId(_id);
  try {
    const findUser = await User.findById(_id).populate('whishlist'); //this will get my wishlist
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//user cart
export const userCart = expressAsyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already exist in d cart
    //order is in d cart while user._id is coming from User
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.deleteOne(); //remove()
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // console.log(products, cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save(); //save it in to the cart model
    res.json(newCart);

    // find cart total
  } catch (error) {
    throw new Error(error);
  }
});

export const getUserCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      'products.product'
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export const emptyCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id }); //find that id of the user
    // console.log(cart);
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// apply coupon

export const applyCoupon = expressAsyncHandler(async (req, res) => {
  const { coupon } = req.body; //get coupon code from the body as they type
  const { _id } = req.user;
  validateMongodbId(_id);
  const validateCoupon = await Coupon.findOne({ name: coupon }); //find name and pass the d coupon code from the body to it
  // console.log(validateCoupon);
  // check if coupon is valid
  if (validateCoupon === null) throw new Error('Invalid coupon');

  // otherwise
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate('products.product');
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validateCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

// cash on delivery
export const createOrder = expressAsyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    if (!COD) throw new Error('Create cash order failed');
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: 'COD',
        amount: finalAmount,
        status: 'Cash on delivery',
        created: Date.now(),
        currency: 'usd',
      },
      orderby: user._id,
      orderStatus: 'Cash on delivery',
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: 'success' });
  } catch (error) {
    throw new Error(error);
  }
});

export const getOrders = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const userOrders = await Order.findOne({ orderby: _id })
      .populate('products.product')
      .populate('orderby')
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

// get all orders
export const getAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const allUserOrders = await Order.find()
      .populate('products.product')
      .populate('orderby')
      .exec();
    res.json(allUserOrders);
  } catch (error) { 
    throw new Error(error);
  }
});

export const getOrderByUserId = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const userOrders = await Order.findOne({ orderby: id })
      .populate('products.product')
      .populate('orderby')
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});
