import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js'
import userRouter from './routes/userRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

//app config
connectDB();
connectCloudinary();
const app = express();
const port = process.env.PORT || 5000;



//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors ({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.urlencoded({ extended: true }));
// routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/payment', paymentRouter);
//api endpointes
app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));