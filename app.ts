import express, { Request, Response, NextFunction } from 'express';
const app = express();
import cors from 'cors';
import { CorsOptions } from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
require('dotenv').config();

const whiteList = [process.env.LOCAL_URL, 'http://localhost:5173'];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,PUT,PATCH,HEAD,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./api'));

// app.use('/', (req: Request, res: Response) => {
//   res.status(200).json({
//     title: 'Hello World!',
//     description:
//       'This is the backend for the finance stock app - auth access needed to advanced features',
//     code: 200,
//     data: null,
//     status: 'success',
//     timestamp: Date.now(),
//     version: '1.0.0',
//   });
// });
// error handling endware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  console.error(err.stack);
  const errStatus = (err as any).status || 500;
  res.status(errStatus).send(err.message || 'Internal server error.');
});

module.exports = app;
