import express from 'express';
import {getAllDoctors, getDoctorById} from '../controllers/doctorController.js';

const doctorRouter = express.Router();
doctorRouter.get('/all-doctors', getAllDoctors);
doctorRouter.get('/:docId', getDoctorById);
export default doctorRouter;