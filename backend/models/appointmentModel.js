import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId:    { type: String, required: true },  // ref to User
  docId:     { type: String, required: true },  // ref to Doctor
  slotDate:  { type: String, required: true },  // "2026-04-20"
  slotTime:  { type: String, required: true },  // "10:00"
  userData:  { type: Object, required: true },  // snapshot of user at booking time
  docData:   { type: Object, required: true },  // snapshot of doctor at booking time
  amount:    { type: Number, required: true },
  date:      { type: Number, required: true },  // Date.now() timestamp
  cancelled: { type: Boolean, default: false },
  payment:   { type: Boolean, default: false },
  isCompleted:{ type: Boolean, default: false },
}, { timestamps: true })
const  Appointment =  mongoose.model. Appointment || mongoose.model(' Appointment', appointmentSchema);
export default  Appointment;