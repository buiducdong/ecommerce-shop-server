import express from 'express';
import products from './data/Products.js';
import connectDatabase from './config/MongoDB.js';
import dotenv from 'dotenv';
import ImportData from './DataImport.js';
import Product from './Models/ProductModel.js';
import { notFound, errorHandle } from './Middleware/Errors.js';
import ProductRoute from './Routes/ProductRoutes.js';
import UserRouter from './Routes/UserRoutes.js';
import OrderRoute from './Routes/OrderRoutes.js';
import cors from 'cors';
dotenv.config();
const port = process.env.PORT || 8000;
connectDatabase();
const app = express();
app.use(express.json());
app.use(cors());

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
