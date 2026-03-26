import Doctor from '../models/doctorModel.js';

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

export {getAllDoctors, getDoctorById}