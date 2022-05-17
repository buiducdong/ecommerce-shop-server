import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import protect from '../Middleware/AuthMiddleware.js';

const ProductRoute = express.Router();

// GET ALL PRODUCTS
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

// GET SINGLE PRODUCT
ProductRoute.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('product not found');
    }
  })
);

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
