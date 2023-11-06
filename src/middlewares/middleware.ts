import * as jwt from 'jsonwebtoken';

export const authenticated = (req, res, next) => {
   try {
      const authHeader = req.get('Authorization');

      const token = authHeader.split(' ')[1]; //Bearer Token => ['Bearer', token]

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // return res.send(decodedToken)
      req.userId = decodedToken._id;
      req.username = decodedToken.username;
      next();
   } catch (err) {
      err.statusCode = 401;
      err.message = "You don't have permission";
      next(err);
   }
};
