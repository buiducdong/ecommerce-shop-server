import express from 'express';
import User from './Models/UserModel.js';
import Product from './Models/ProductModel.js';
import users from './data/Users.js';
import products from './data/Products.js';
import asyncHandler from 'express-async-handler';
const ImportData = express.Router();

// import User
ImportData.post(
  '/user',
  asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send(importUser);
  })
);

// import product
ImportData.post(
  '/product',
  asyncHandler(async (req, res) => {
    await Product.remove({});
    const importProduct = await Product.insertMany(products);
    res.send(importProduct);
  })
);

export default ImportData;
