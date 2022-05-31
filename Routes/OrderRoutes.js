import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import { protect } from '../Middleware/AuthMiddleware.js';
import Order from '../Models/OrderModel.js';

const OrderRoute = express.Router();

// CREATE ORDER
OrderRoute.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length != 0) {
      const order = new Order({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createOrder = await order.save();
      return res.status(200).json(createOrder);
    } else {
      console.log('no item in cart');
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// GET ORDER BY ID
OrderRoute.get('/:id', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      return res.status(200).json(order);
    } else {
      console.log('no order');
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// ORDER IS PAID
OrderRoute.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_item: req.body.update_item,
        email_address: req.body.email_address,
      };
      const updateOrder = await order.save();
      return res.status(200).json(updateOrder);
    } else {
      console.log('no order');
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// USER LOGIN ORDER
OrderRoute.get('/', protect, async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });

    res.status(200).json(order);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default OrderRoute;
