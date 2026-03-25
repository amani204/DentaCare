import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import connectCloudinary from './config/cloudinary';
import adminRouter from './routes/adminRoutes.js'
//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors ({ origin: 'http://localhost:5173', credentials: true }));

// routes
app.use('/api/admin', adminRouter);

//api endpointes
app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));