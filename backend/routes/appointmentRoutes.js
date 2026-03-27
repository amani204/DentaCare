import express from 'express';
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController.js';
import {authPatient} from '../middleware/authMiddleware.js';

const appointmentRouter = express.Router();

//all routes require authentication
appointmentRouter.post('/book', authPatient, createAppointment);
appointmentRouter.get('/list', authPatient, getAppointments);
appointmentRouter.post('/cancel', authPatient, cancelAppointment);

export default appointmentRouter;   