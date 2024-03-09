import express from 'express';
import { registerUserCtrl, loginUserCrtl } from '../controllers/usersCtrl.js';


const userRoutes = express.Router();

userRoutes.post('/api/v1/users/register',registerUserCtrl);
userRoutes.post('/api/v1/users/login', loginUserCrtl);


export default userRoutes;