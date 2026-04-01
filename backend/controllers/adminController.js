import validator from 'validator';
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';  
import User from '../models/userModel.js';   
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
        if (!name || !email || !password || !speciality || !degree || !experience || !fees || !address ) {
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
            address: parsedAddress, 
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
        const { docId } = req.params
        const doctor = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId, {
        available: !doctor.available
    })
    res.status(200).json({ success: true, message: 'Availability toggled' });

    } catch (error) {
     return res.status(500).json({ success: false, message: error.message });
    }
}

// View all appointments
const getAllAppointments = async (req, res) => {
    try {
        // Get all appointments with patient and doctor details
        const appointments = await Appointment.find({})
            .sort({ createdAt: -1 });  // Newest first
        res.status(200).json({ success: true, count: appointments.length, appointments });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel any appointment (admin override)
const adminCancelAppointment = async (req, res) => {
    try {
        const { appointmentId, reason } = req.body;
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        // Find appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check if already cancelled
        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
        }

        // Mark as cancelled (admin override)
        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            cancellationReason: reason || 'Cancelled by admin',
            cancellationBy: 'admin'
        });

        // Release the slot back to doctor
        const { docId, slotDate, slotTime } = appointment;
        const doctor = await Doctor.findById(docId);
        if (doctor && doctor.slots_booked && doctor.slots_booked[slotDate]) {
            doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
                time => time !== slotTime
            );
            
            if (doctor.slots_booked[slotDate].length === 0) {
                delete doctor.slots_booked[slotDate];
            }
            await doctor.save();
        }
        res.status(200).json({ success: true, message: 'Appointment cancelled by admin successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//delet Doctor 
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.params
    
    const doctor = await Doctor.findById(docId)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }
    
    await Doctor.findByIdAndDelete(docId)
    
    res.json({ success: true, message: 'Doctor deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Admin dashboard with all stats
const getAdminDashboard = async (req, res) => {
    try {
        // Get all doctors
        const doctors = await Doctor.find({});
        const totalDoctors = doctors.length;
        const availableDoctors = doctors.filter(d => d.available).length;

        // Get all patients
        const patients = await User.find({ role: 'patient' });
        const totalPatients = patients.length;

        // Get all appointments
        const appointments = await Appointment.find({});
        const totalAppointments = appointments.length;
        
        // Appointment stats
        const completedAppointments = appointments.filter(a => a.isCompleted).length;
        const cancelledAppointments = appointments.filter(a => a.cancelled).length;
        const pendingAppointments = appointments.filter(a => !a.cancelled && !a.isCompleted).length;
        
        // Payment stats
        const paidAppointments = appointments.filter(a => a.isPaid).length;
        const totalRevenue = appointments
            .filter(a => a.isPaid && !a.cancelled)
            .reduce((sum, a) => sum + a.amount, 0);
        
        // Recent appointments (last 10)
        const recentAppointments = await Appointment.find({})
            .sort({ createdAt: -1 })
            .limit(10);

        // Today's appointments
        const today = new Date();
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
        
        const todayAppointments = await Appointment.find({
            slotDate: todayStr,
            cancelled: false
        });

        // Upcoming appointments (next 7 days)
        const upcomingAppointments = await Appointment.find({
            cancelled: false,
            isCompleted: false
        }).sort({ slotDate: 1, slotTime: 1 }).limit(10);

        res.status(200).json({ success: true,
            dashboard: {
                doctors: {
                    total: totalDoctors,
                    available: availableDoctors,
                    unavailable: totalDoctors - availableDoctors
                },
                patients: {
                    total: totalPatients
                },
                appointments: {
                    total: totalAppointments,
                    completed: completedAppointments,
                    cancelled: cancelledAppointments,
                    pending: pendingAppointments,
                    today: todayAppointments.length
                },
                revenue: {
                    total: totalRevenue,
                    paidAppointments: paidAppointments
                },
                recentAppointments,
                upcomingAppointments
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {adminLogin, addDoctor, getAllDoctors, getDoctorById, toggleDoctorAvailability,  getAllAppointments, adminCancelAppointment,deleteDoctor, getAdminDashboard };