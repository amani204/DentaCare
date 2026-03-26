import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel.js';


// helper — generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

//API to register user
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        //check that all fields are filled
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'Please fill all the fields'})
        }
        //validate email format
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: 'Please enter a valid email'})
        }
        //validate password length
        if(password.length < 8){
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters'})
        }
        //check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: 'Email already exists'})
        }
        //hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create user
        const newUser = await User.create({name, email, password: hashedPassword});
        const user = await newUser.save();
        //return token
        const token = generateToken(user._id)
        res.json({ success: true, token })
   
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}
//API to login user
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        //find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: 'Invalid credentials'})
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success: false, message: 'Invalid credentials'})
        }
        //return token
        const token = generateToken(user._id)
        res.json({ success: true, token })
    }
    catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}


//API to get user profile 
const getProfile = async (req, res) => {
    try {
        //userId was attached bu authUser middleware
         const { userId } = req.body
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        res.json({ success: true, user })
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

//API to update user profile 
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    const updateData = {}

    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (dob) updateData.dob = dob
    if (gender) updateData.gender = gender
    if (address) updateData.address = JSON.parse(address)

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image'
      })
      updateData.image = imageUpload.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' })
    }

    await User.findByIdAndUpdate(userId, updateData, { new: true })
    res.status(200).json({ success: true, message: 'Profile updated successfully' })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message 
        });
    }
};


export {registerUser, loginUser, getProfile, updateProfile, logoutUser}
