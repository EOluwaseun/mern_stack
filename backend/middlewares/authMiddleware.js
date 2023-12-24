import jwt from 'jsonwebtoken';
// import User from '../models/userModel';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // need second value
    try {
      if (token) {
        //if token exist, we need to decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id); //d id from d decoded user
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized token expired, Please Login again');
    }
  } else {
    throw new Error('There is no token attached to header');
  }
});

// admin authorization or middleware
export const isAdmin = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email }); //find the email
  if (adminUser.role !== 'admin') {
    throw new Error('You are not an admin');
  } else {
    next(); // grant request
  }
});
