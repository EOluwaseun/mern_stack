import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';
import blogRoute from './routes/blogRoute.js';
import categorygRoute from './routes/categoryRoute.js';
import blogcatRoute from './routes/blogcatRoute.js';
import brandRoute from './routes/brandRoute.js';
import colorRoute from './routes/colorRoute.js';
import enquiryRoute from './routes/enqRoutes.js';
import couponRoute from './routes/couponRoute.js';
import uploadRoute from './routes/uploadRoute.js';

import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categorygRoute);
app.use('/api/blogcategory', blogcatRoute);
app.use('/api/brand', brandRoute);
app.use('/api/color', colorRoute);
app.use('/api/enquiry', enquiryRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/upload', uploadRoute);
// app.use('/uploads', express.static(path.join(__dirname, '../public/images/')));

// this must be here
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server at localhost ${PORT}`);
});
