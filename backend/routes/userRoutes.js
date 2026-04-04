import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, logoutUser, sendResetOtp, resetPassword, verifyResetOtp } from '../controllers/userController.js';
import { authPatient } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'
const userRouter = express.Router();

//public routes no token needed
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/verify-reset-otp', verifyResetOtp);
userRouter.post('/reset-password', resetPassword);
//protected routes token required
userRouter.get('/profile', authPatient, getProfile);
userRouter.put('/update-profile', authPatient,upload.single('image'), updateProfile);

export default userRouter;