import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  image:       { type: String, required: true },  // Cloudinary URL
  speciality:  { type: String, required: true },
  degree:      { type: String, required: true },
  experience:  { type: String, required: true },
  about:       { type: String, required: true },
  available:   { type: Boolean, default: true },
  fees:        { type: Number, required: true },
  address:     { type: Object, default: { line1:'', line2:'' } },
  date:        {type: Number, required: true},
  slots_booked:{ type: Object, default: {} }, // { "2026-04-20": ["10:00","11:00"] }
}, { timestamps: true, // Automatically adds and manages createdAt and updatedAt fields
     minimize: false  // Keeps empty objects
 });

const Doctor =  mongoose.model.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;