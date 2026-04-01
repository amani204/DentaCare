import express from 'express';
import {adminLogin, addDoctor, getAllDoctors, getDoctorById, toggleDoctorAvailability, getAllAppointments, adminCancelAppointment, deleteDoctor, getAdminDashboard} from '../controllers/adminController.js';
import {authAdmin} from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const adminRouter = express.Router();
adminRouter.post('/login',adminLogin);
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.get('/doctors',authAdmin,getAllDoctors);
adminRouter.get('/doctors/:docId',authAdmin,getDoctorById);
adminRouter.put('/doctors/:docId',authAdmin,toggleDoctorAvailability);
adminRouter.delete('/doctors/:docId', authAdmin, deleteDoctor)
adminRouter.get('/appointments', authAdmin, getAllAppointments);     
adminRouter.post('/cancel', authAdmin, adminCancelAppointment);       
adminRouter.get('/dashboard', authAdmin, getAdminDashboard);      
export default adminRouter;