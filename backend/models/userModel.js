import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['patient','admin'], default: 'patient' },
  image:    { type: String, default: '' },
  dob:      { type: String, default: '' },
  gender:   { type: String, default: 'Not Selected' },
  phone:    { type: String, default: '0000000000' },
  address:  { type: Object, default: { line1:'', line2:'' } },
}, { timestamps: true })

const User =  mongoose.model.User || mongoose.model('User', userSchema);
export default User;