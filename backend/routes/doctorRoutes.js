import express from 'express';
import {completeAppointment, doctorCancelAppointment, doctorLogin, getAllDoctors, getDoctorAppointments, getDoctorById, getDoctorDashboard, getIncomingAppointments, updateDoctorProfile} from '../controllers/doctorController.js';
import { authDoctor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const doctorRouter = express.Router();
doctorRouter.post('/login', doctorLogin);
doctorRouter.get('/all-doctors', getAllDoctors);

// Protected routes (doctor token required)
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments);
doctorRouter.get('/incoming', authDoctor, getIncomingAppointments);
doctorRouter.post('/complete', authDoctor, completeAppointment);
doctorRouter.post('/cancel', authDoctor, doctorCancelAppointment);
doctorRouter.get('/dashboard', authDoctor, getDoctorDashboard);
doctorRouter.put('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile);
doctorRouter.get('/:docId', getDoctorById);

export default doctorRouter;