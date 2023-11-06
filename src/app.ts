import express, { Request, Response, Application } from 'express';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';

import router from './routes/index';
import { connectDb } from './config/db';
import { init } from './config/init';
import { errors } from './middlewares/errors';

const PORT = process.env.PORT;

try {
   const app: Application = express();
   // const app = express();

   app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader(
         'Access-Control-Allow-Headers',
         'Content-Type, Authorization',
      );
      next();
   });

   connectDb();

   app.use(
      fileUpload({
         createParentPath: true,
      }),
   );

   app.use(express.urlencoded({ extended: false }));
   app.use(express.json());

   init();
   console.log(process.env.BASE_URL);

   if (process.env.NODE_ENV == 'development') {
      app.use('/static', express.static(path.join(__dirname, '..', 'static')));
   }

   app.use('/api', router);

   // handle error
   app.use(errors);

   app.listen(PORT, () => {
      console.log(`server run on port ${PORT}`);
   });
} catch (e) {
   console.log(e);
}
