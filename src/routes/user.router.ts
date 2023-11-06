// import { router } from './dashboard-routes';
import { Router } from 'express';

import {
   registerUser,
   signInUser,
   getUser,
   getUsers,
   editUser,
   nimaStuff,
} from '../controller/user.controller';
import { authenticated } from '../middlewares/middleware';

export const router = Router();

// register user
router.post('/users/register', registerUser);
// sign in
router.post('/users/sign-in', signInUser);
// get user
router.get('/users/get-user', authenticated, getUser);
// get users
router.get('/users', authenticated, getUsers);
// Edit User
router.put('/users/:id', authenticated, editUser);

// Temp (add all stuff to Nima)
router.post('/users/nima', authenticated, nimaStuff);

export default router;
