import jwt from 'jsonwebtoken';

//------------ADMIN AUTH MIDDLLWEARE---------------

// verifies the token sent in the Authorization header
const authAdmin = async (req, res, next) => {
  try {
    //extract atoken from headers
    const { atoken } = req.headers
    //token exists?
    if (!atoken) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    // check that the token belongs to the admin email
    if (token_decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
    //go to controller
    next()
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}

//------------PATIENT AUTH MIDDLEWARE------------------

const authPatient = async (req, res, next) => {
  try {
    //extract patient token from headers
    const { token } = req.headers
    //token exists?
    if (!token) {
      return res.status(400).json({ success: false, message: 'Not authorized, login again' })
    }
    //Verify token with JWT secret
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user id to req.body so controllers can use it
    req.userId = decoded.id ;
    //go to controller
    next()
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}

//------------DOCTOR AUTH MIDDLEWARE------------------
const authDoctor = async (req, res, next) => {
  try {
    //Extract dtoken from headers
    const {dtoken} = req.headers;
    //dtoken exists?
    if(!dtoken){
      return res.status(401).json({ success: false, message: 'Not authorized, doctor login required'});
    }
    //Verify token with JWT secret
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    //verify it's the doctor token by the checking the role
    if(decoded.role !== 'doctor'){
      return res.status(403).json({ success: false, message: 'Doctor access required'});
    }

     // attach the doctor id to req.body so controllers can use it
    req.doctorId = decoded.id;
    //go to controller
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, login again' });
  }
}

export {authAdmin, authPatient, authDoctor }