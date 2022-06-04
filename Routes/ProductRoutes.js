import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import { admin, protect } from '../Middleware/AuthMiddleware.js';

const ProductRoute = express.Router();

// GET ALL PRODUCTS FOLLOW PAGE
ProductRoute.get(
  '/',
  asyncHandler(async (req, res) => {
    const pageSize = 3;
    const page = req.query.pageNumber || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// GET ALL PRODUCTS
ProductRoute.get('/all', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...keyword }).sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// GET ALL PRODUCT OF ADMIN
ProductRoute.get('/all', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

// DELETE SINGLE PRODUCT ADMIN
ProductRoute.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product has been delete' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

// CREATE PRODUCT ADMIN
ProductRoute.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, countInStock, image } = req.body;
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400).json({ message: 'Product name already exist' });
    } else {
      const product = new Product({
        name,
        price,
        description,
        countInStock,
        image,
        user: req.user._id,
      });
      if (product) {
        const createProduct = await product.save();
        res.status(201).json(createProduct);
      } else {
        res.status(404).json({ message: 'Invalid product data' });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

// EDIT PRODUCT ADMIN
ProductRoute.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, countInStock, image } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.countInStock = countInStock || product.countInStock;
      product.image = image || product.image;
      const updateProduct = await product.save();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: ' product not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

// GET SINGLE PRODUCT
ProductRoute.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

// PRODUCT REVIEW
ProductRoute.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      return res.status(200).json({ message: 'Reviewed added' });
    } else {
      return res.status(400).json({ message: 'Product not Found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

export default ProductRoute;
