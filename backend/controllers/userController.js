import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// helper — generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Generate OTP
const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// Email Templates
const getWelcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to DentaCare</title>
  <style>
    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #2C2C2A; }
    .logo span { color: #94D7BC; }
    h2 { color: #2C2C2A; margin-bottom: 16px; }
    p { color: #666; line-height: 1.6; margin-bottom: 16px; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #94D7BC; color: #2C2C2A; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Denta<span>Care</span></div>
      </div>
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for choosing DentaCare for your dental health needs. We're excited to have you on board!</p>
      <p>You can now book appointments with our expert doctors, track your dental history, and manage your oral health — all from your dashboard.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.FRONTEND_URL}/doctors" class="btn">Book Your First Appointment</a>
      </div>
      <p>If you have any questions, our support team is here to help.</p>
      <p>Best regards,<br><strong>The DentaCare Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 DentaCare. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

const getVerifyOTPTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - DentaCare</title>
  <style>
    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #2C2C2A; }
    .logo span { color: #94D7BC; }
    h2 { color: #2C2C2A; margin-bottom: 16px; }
    p { color: #666; line-height: 1.6; margin-bottom: 16px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #94D7BC; text-align: center; letter-spacing: 8px; margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 12px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Denta<span>Care</span></div>
      </div>
      <h2>Verify Your Email Address</h2>
      <p>Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for <strong>10 minutes</strong>.</p>
      <div class="otp-code">${otp}</div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br><strong>The DentaCare Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 DentaCare. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

const getResetPasswordOTPTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - DentaCare</title>
  <style>
    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #2C2C2A; }
    .logo span { color: #94D7BC; }
    h2 { color: #2C2C2A; margin-bottom: 16px; }
    p { color: #666; line-height: 1.6; margin-bottom: 16px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #94D7BC; text-align: center; letter-spacing: 8px; margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 12px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Denta<span>Care</span></div>
      </div>
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Use the following OTP to proceed. This OTP is valid for <strong>15 minutes</strong>.</p>
      <div class="otp-code">${otp}</div>
      <p>If you didn't request this, please ignore this email or contact support.</p>
      <p>Best regards,<br><strong>The DentaCare Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 DentaCare. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' })
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }
        
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            isAccountVerified: false
        });
        
        const token = generateToken(newUser._id);
        
        // Send welcome email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to DentaCare!',
            html: getWelcomeEmailTemplate(name)
        })
        
        res.json({ success: true, token, user: { id: newUser._id, name, email } })
   
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }
        
        const token = generateToken(user._id);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// API to get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    const updateData = {}

    if (name) updateData.name = name
    if (phone) updateData.phone = phone

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image'
      })
      updateData.image = imageUpload.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true }).select('-password')
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User Not Found' })
    }
    
    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to logout user
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// ========== FORGOT PASSWORD & OTP FUNCTIONS ==========

// Send OTP for email verification (when registering)
const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }
        
        const otp = generateOTP();
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
        
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Email - DentaCare',
            html: getVerifyOTPTemplate(otp)
        });
        
        res.json({ success: true, message: 'OTP sent to your email' });
        
    } catch (error) {
        console.error('Send verify OTP error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Verify email with OTP
const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;
        
        if (!otp) {
            return res.status(400).json({ success: false, message: 'OTP is required' });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();
        
        res.json({ success: true, message: 'Email verified successfully' });
        
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Send OTP for password reset (forgot password)
const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const otp = generateOTP();
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Password - DentaCare',
            html: getResetPasswordOTPTemplate(otp)
        });
        
        res.json({ success: true, message: 'OTP sent to your email' });
        
    } catch (error) {
        console.error('Send reset OTP error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Verify OTP and reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        await user.save();
        
        res.json({ success: true, message: 'Password reset successfully' });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
    const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        if (user.resetOtp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }
        
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired' 
            });
        }
        
        // Generate a temporary token for password reset
        const tempToken = jwt.sign(
            { email: user.email, purpose: 'reset-password' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        
        res.json({ 
            success: true, 
            message: 'OTP verified successfully',
            token: tempToken
        });
        
    } catch (error) {
        console.error('Verify reset OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}


export { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    logoutUser,
    sendVerifyOtp,
    verifyEmail,
    sendResetOtp,
    resetPassword, verifyResetOtp
}