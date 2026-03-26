import jwt from 'jsonwebtoken';

//------------ADMIN AUTH MIDDLLWEARE---------------

// verifies the token sent in the Authorization header
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    // check that the token belongs to the admin email
    if (token_decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
    next()
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}

//------------PATIENT AUTH MIDDLEWARE------------------

const authPatient = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user id to req.body so controllers can use it
    req.user = decoded;
    req.userId = decoded.id || decoded.userId;
    next()
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}


export {authAdmin, authPatient}