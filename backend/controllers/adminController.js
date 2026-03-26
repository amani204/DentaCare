import validator from 'validator';
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';

// API for admin login
const adminLogin = async (req, res) => {
    try {
    const {email, password} = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS ){
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })
         return res.status(200).json({ success: true, message: 'Login successful', token });
    }
    else {
       return res.status(400).json({ success: false, message: 'Invalid credentials'});
    }
    } catch (error) {
     res.status(500).json({ success: false, message: error.message });
    }
   }

//API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const {name, email, password, speciality, degree, experience, fees, address} = req.body;
        const imageFile = req.file; 
        //checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !fees || !address || !imageFile) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        //validating email format 
        if (!validator.isEmail(email)) {
           return res.status(400).json({ success: false, message: 'Invalid email format' }) ;
        }
        //validation strong password
        if(password.length < 8){
            return res.status(400).json({ success: false, message: 'Please enter valid password'});
        }
        //hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        //upload image to cloudinary 
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
        const imageUrl = imageUpload.secure_url; 
        
        // Parse address safely
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid address format' });
        }
        //creating doctor object to save in database
        const newDoctor = new Doctor({
            name,
            email,
            password: hashPassword,
            speciality,
            degree,
            experience,
            fees,
            address: parsedAddress, // Use the parsed address
            date:Date.now(),
            image: imageUrl,
            available: true
        });
        await newDoctor.save();
        res.status(201).json({ success: true, message: 'Doctor added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}
//get all doctors API for admin dashboard
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password'); // Exclude password field
        res.status(200).json({ success: true, doctors });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching doctors' });
    }
}
//get doctor by ID 
const getDoctorById = async (req, res) => {
    try {
       const {docId} = req.params;
       const doctor = await Doctor.findById(docId).select('-password'); 
       if (!doctor) {
         return res.status(404).json({ success: false, message: 'Doctor not found' });
       }
       res.status(200).json({ success: true, doctor });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
}

//toggle doctor availability
const toggleDoctorAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId, {
        available: !doctor.available
    })
    res.status(200).json({ success: true, message: 'Availability toggled' });

    } catch (error) {
     return res.status(500).json({ success: false, message: error.message });
    }
}
export {adminLogin, addDoctor, getAllDoctors, getDoctorById, toggleDoctorAvailability};