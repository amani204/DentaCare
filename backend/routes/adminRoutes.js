import express from 'express';
import {adminLogin, addDoctor, getAllDoctors, getDoctorById, toggleDoctorAvailability} from '../controllers/adminController.js';
import {authAdmin} from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const adminRouter = express.Router();
adminRouter.post('/admin-login',adminLogin);
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.get('/all-doctors',authAdmin,getAllDoctors);
adminRouter.get('/doctors/:docId',authAdmin,getDoctorById);
adminRouter.put('/doctors/:docId',authAdmin,toggleDoctorAvailability);
export default adminRouter;