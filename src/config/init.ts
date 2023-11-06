import * as fs from 'fs';
import * as path from 'path';

const user = 'nima';

export const init = () => {
  if (process.env.NODE_ENV == 'development') {
    process.env.BASE_URL = `http://localhost:${process.env.PORT}`;
  }

  fs.mkdir(path.join(__dirname, '..', '..', 'static'), err => {});
  fs.mkdir(path.join(__dirname, '..', '..', 'static', `${user}`), err => {});
  fs.mkdir(
    path.join(__dirname, '..', '..', 'static', `${user}`, 'vocabs'),
    err => {},
  );
  fs.mkdir(
    path.join(__dirname, '..', '..', 'static', `${user}`, 'sentences'),
    err => {},
  );
};
