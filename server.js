import express from 'express';
import products from './data/Products.js';
// import connectDatabase from './config/MongoDB.js';
import dotenv from 'dotenv';
import ImportData from './DataImport.js';
import Product from './Models/ProductModel.js';
import { notFound, errorHandle } from './Middleware/Errors.js';
import ProductRoute from './Routes/ProductRoutes.js';
import UserRouter from './Routes/UserRoutes.js';
import OrderRoute from './Routes/OrderRoutes.js';
import cors from 'cors';
import mongoose from 'mongoose';

const port = process.env.PORT || 8000;
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

// API
app.use('/api/import', ImportData);
app.use('/api/products', ProductRoute);
app.use('/api/users', UserRouter);
app.use('/api/orders', OrderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERRORS
// app.use(notFound);
// app.use(errorHandle);

app.get('/', (req, res) => {
  res.send('api is rungning...');
});

app.listen(port, () => {
  console.log(`server running in host: \'http://localhost:${port}\'`);
});
