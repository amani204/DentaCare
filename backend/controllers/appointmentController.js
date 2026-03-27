import Appointment from '../models/appointmentModel.js'
import Doctor from '../models/doctorModel.js'
import User from '../models/userModel.js'

const createAppointment = async (req, res) => {
  try {
    const userId = req.userId
    const { docId, slotDate, slotTime } = req.body

    const doctor = await Doctor.findById(docId).select('-password')
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'Doctor not available' })
    }

    let slots_booked = doctor.slots_booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({ success: false, message: 'Slot already booked' })
      }
    }

    const patient = await User.findById(userId).select('-password')
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    if (slots_booked[slotDate]) {
      slots_booked[slotDate].push(slotTime)
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    await Doctor.findByIdAndUpdate(docId, { slots_booked })

    const newAppointment = new Appointment({
      docId,
      userId,
      userData: patient,   
      docData: doctor,     
      amount: doctor.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    })

    await newAppointment.save()  
    res.status(201).json({ success: true, message: 'Appointment created successfully' })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAppointments = async (req, res) => {
  try {
    const userId = req.userId
    const appointments = await Appointment.find({ userId })
    res.status(200).json({ success: true, appointments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    if (appointment.userId !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    // mark as cancelled 
    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })

    // release the slot
    const { docId, slotDate, slotTime } = appointment
    const doctor = await Doctor.findById(docId)
    let slots_booked = doctor.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      time => time !== slotTime
    )

    await Doctor.findByIdAndUpdate(docId, { slots_booked })

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export { createAppointment, getAppointments, cancelAppointment }