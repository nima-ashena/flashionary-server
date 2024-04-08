import * as fs from 'fs';
import * as path from 'path';

export const init = () => {
  if (process.env.NODE_ENV == 'development') {
    process.env.BASE_URL = `http://localhost:${process.env.PORT}`;
  }

  fs.mkdir(
    path.join(__dirname, '..', '..', 'static', 'audios'),
    err => {},
  );
};
