import * as fs from 'fs';
import * as path from 'path';
import { User } from '../models/user.model';

export const init = async () => {
  if (process.env.NODE_ENV == 'development') {
    process.env.BASE_URL = `http://localhost:${process.env.PORT}`;
  }

  fs.mkdir(
    path.join(__dirname, '..', '..', 'static'),
    err => {},
  );
  fs.mkdir(
    path.join(__dirname, '..', '..', 'static', 'audios'),
    err => {},
  );

  let user = await User.findOne({ name: 'Nima' });
  if (!user) {
    user = await User.create({
       name: 'Nima',
       username: 'nima',
       password: 'mingo',
       email: 'nima@nima.com',
    });
  }
};
