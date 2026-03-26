import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, logoutUser } from '../controllers/userController.js';
import { authPatient } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'
const userRouter = express.Router();

//public routes no token needed
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
//protected routes token required
userRouter.get('/profile', authPatient, getProfile);
userRouter.put('/update-profile', authPatient,upload.single('image'), updateProfile);

export default userRouter;