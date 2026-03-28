import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import { v2 as cloudinary } from 'cloudinary';

//get all doctors
const getAllDoctors = async (req, res ) =>{
    try {
        const doctors = await Doctor.find({available: true}).select('-password -email');
        res.status(200).json({success: true, data: doctors})
    } catch (error) {
       res.status(500).json({success: false, message: error.message}) 
    }
}

//get doctor by id
const getDoctorById = async (req, res) => {
    try {
        const { docId } = req.params;
        const doctor = await Doctor.findById(docId).select('-password -email');
        if (!doctor) {
            return res.status(404).json({success: false, message: 'Doctor not found'});
        }
        res.status(200).json({success: true, data: doctor});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}




// DOCTOR LOGIN 
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token with role
        const dtoken = jwt.sign( { id: doctor._id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '7d' } );
        res.json({ success: true, dtoken, 
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                fees: doctor.fees,
                available: doctor.available,
                image: doctor.image
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message
        });
    }
};

// GET DOCTOR APPOINTMENTS
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointments = await Appointment.find({ docId: doctorId })
            .sort({ slotDate: -1, slotTime: 1 });

        res.json({ success: true, appointments });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// MARK APPOINTMENT AS COMPLETED 
const completeAppointment = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { appointmentId } = req.body;
        // Find appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Verify ownership
        if (appointment.docId.toString() !== doctorId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Check if already completed or cancelled
        if (appointment.isCompleted) {
            return res.status(400).json({ success: false, message: 'Appointment already completed' });
        }

        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Cannot complete cancelled appointment' });
        }

        // Mark as completed
        await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true});
        res.json({ success: true, message: 'Appointment marked as completed' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET INCOMING APPOINTMENTS 
const getIncomingAppointments = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const today = new Date();
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

        // Get upcoming appointments (not cancelled, not completed)
        const appointments = await Appointment.find({ docId: doctorId, cancelled: false, isCompleted: false }).sort({ slotDate: 1, slotTime: 1 });
        res.json({ success: true, appointments });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DOCTOR CANCELS APPOINTMENT 
const doctorCancelAppointment = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { appointmentId, reason } = req.body;
        // Find appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Verify ownership
        if (appointment.docId.toString() !== doctorId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Check if already cancelled
        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
        }

        // Mark as cancelled
        await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true, cancellationReason: reason || 'Cancelled by doctor', cancellationBy: 'doctor' });

        // Release the slot back to doctor
        const { slotDate, slotTime } = appointment;
        const doctor = await Doctor.findById(doctorId);
        if (doctor && doctor.slots_booked && doctor.slots_booked[slotDate]) {
            doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
                time => time !== slotTime
            );
            
            if (doctor.slots_booked[slotDate].length === 0) {
                delete doctor.slots_booked[slotDate];
            }
            await doctor.save();
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DOCTOR DASHBOARD (Earnings + Stats) 
const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        // Get all appointments for this doctor
        const allAppointments = await Appointment.find({ docId: doctorId });
        // Calculate stats
        const totalAppointments = allAppointments.length;
        const completedAppointments = allAppointments.filter(a => a.isCompleted).length;
        const cancelledAppointments = allAppointments.filter(a => a.cancelled).length;
        const pendingAppointments = allAppointments.filter(a => !a.cancelled && !a.isCompleted).length;
        // Calculate earnings (only from completed appointments)
        const totalEarnings = allAppointments
            .filter(a => a.isCompleted && !a.cancelled)
            .reduce((sum, a) => sum + a.amount, 0);
        // Get upcoming appointments
        const upcomingAppointments = await Appointment.find({
            docId: doctorId,
            cancelled: false,
            isCompleted: false
        }).sort({ slotDate: 1, slotTime: 1 }).limit(5);

        // Get doctor details
        const doctor = await Doctor.findById(doctorId).select('-password');
        res.json({ success: true,
            dashboard: {
                stats: {
                    totalAppointments,
                    completedAppointments,
                    cancelledAppointments,
                    pendingAppointments,
                    totalEarnings
                },
                upcomingAppointments,
                doctor: {
                    name: doctor.name,
                    speciality: doctor.speciality,
                    fees: doctor.fees,
                    available: doctor.available,
                    image: doctor.image
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false,nmessage: error.message });
    }
};

// DOCTOR UPDATE PROFILE
const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { name, about, fees, available } = req.body;
        const imageFile = req.file;

        const updateData = {};
        
        if (name) updateData.name = name;
        if (about) updateData.about = about;
        if (fees) updateData.fees = fees;
        if (available !== undefined) updateData.available = available;
        
        // Handle image upload if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                folder: 'dentacare/doctors'
            });
            updateData.image = imageUpload.secure_url;
        }
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json({ success: true, message: 'Profile updated successfully', doctor: updatedDoctor });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {getAllDoctors, getDoctorById, doctorLogin, getDoctorAppointments, completeAppointment, 
        getIncomingAppointments, doctorCancelAppointment, getDoctorDashboard, updateDoctorProfile}