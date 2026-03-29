# DentaCare — Backend API Documentation

A full-stack appointment booking system for dental clinics. Built with Node.js, Express, MongoDB, and integrated with Stripe and Chargily payment gateways.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe + Chargily (CIB / Edahabia)
- **Validation**: validator.js

---

## Project Structure

```
backend/
├── config/
│   ├── db.js                  # MongoDB connection
│   └── cloudinary.js          # Cloudinary configuration
├── controllers/
│   ├── adminController.js     # Admin logic
│   ├── doctorController.js    # Doctor logic
│   ├── userController.js      # Patient logic
│   ├── appointmentController.js
│   ├── paymentController.js   # Stripe + Chargily
│   └── reviewController.js
├── middleware/
│   ├── authMiddleware.js      # authAdmin, authPatient, authDoctor
│   └── uploadMiddleware.js    # Multer config
├── models/
│   ├── userModel.js
│   ├── doctorModel.js
│   ├── appointmentModel.js
│   └── reviewModel.js
├── routes/
│   ├── adminRoutes.js
│   ├── doctorRoutes.js
│   ├── userRoutes.js
│   ├── appointmentRoutes.js
│   ├── paymentRoutes.js
│   └── reviewRoutes.js
├── .env
├── .gitignore
└── server.js
```

---

## Environment Variables

Create a `.env` file in the root of the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

ADMIN_EMAIL=admin@dentacare.com
ADMIN_PASS=your_admin_password

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

STRIPE_SECRET_KEY=sk_test_your_stripe_key

CHARGILY_API_KEY=test_sk_your_chargily_key
CHARGILY_MODE=test

FRONTEND_URL=http://localhost:5173
```

---

## Getting Started

```bash
# install dependencies
npm install

# run in development
npm run dev

# run in production
npm start
```

---

## Authentication

The API uses three separate JWT-based auth systems:

| Role    | Header Key | Token Source          |
|---------|------------|-----------------------|
| Patient | `token`    | Login / Register      |
| Doctor  | `dtoken`   | Doctor Login          |
| Admin   | `atoken`   | Admin Login           |

All protected routes require the corresponding header. Tokens expire in 7 days.

---

## API Reference

### Admin Routes — `/api/admin`

| Method | Endpoint           | Auth   | Description                  |
|--------|--------------------|--------|------------------------------|
| POST   | `/login`           | None   | Admin login                  |
| POST   | `/add-doctor`      | Admin  | Add new doctor with image    |
| GET    | `/doctors`         | Admin  | Get all doctors              |
| GET    | `/doctors/:docId`  | Admin  | Get doctor by ID             |
| PUT    | `/doctors/:docId`  | Admin  | Toggle doctor availability   |
| GET    | `/appointments`    | Admin  | Get all appointments         |
| POST   | `/cancel`          | Admin  | Cancel any appointment       |
| GET    | `/dashboard`       | Admin  | Dashboard stats              |

#### POST `/api/admin/login`
```json
// request body
{
  "email": "admin@dentacare.com",
  "password": "admin2026"
}

// response
{
  "success": true,
  "token": "eyJ..."
}
```

#### POST `/api/admin/add-doctor`
```
// form-data (not JSON — image file required)
name, email, password, speciality, degree,
experience, about, fees, address (JSON string), image (file)
```

#### POST `/api/admin/cancel`
```json
// request body
{
  "appointmentId": "appointment_id",
  "reason": "Optional reason"
}
```

---

### User (Patient) Routes — `/api/user`

| Method | Endpoint          | Auth    | Description               |
|--------|-------------------|---------|---------------------------|
| POST   | `/register`       | None    | Patient registration      |
| POST   | `/login`          | None    | Patient login             |
| POST   | `/logout`         | None    | Patient logout            |
| GET    | `/profile`        | Patient | Get patient profile       |
| PUT    | `/update-profile` | Patient | Update profile + image    |

#### POST `/api/user/register`
```json
// request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// response
{
  "success": true,
  "token": "eyJ..."
}
```

#### GET `/api/user/profile`
```json
// headers: token: eyJ...

// response
{
  "success": true,
  "userData": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "",
    "phone": "",
    "address": { "line1": "", "line2": "" },
    "dob": "",
    "gender": ""
  }
}
```

#### PUT `/api/user/update-profile`
```
// form-data
name, phone, dob, gender, address (JSON string), image (file, optional)
```

---

### Doctor Routes — `/api/doctor`

| Method | Endpoint          | Auth   | Description                    |
|--------|-------------------|--------|--------------------------------|
| POST   | `/login`          | None   | Doctor login                   |
| GET    | `/all-doctors`    | None   | Get all available doctors      |
| GET    | `/:docId`         | None   | Get doctor by ID               |
| GET    | `/appointments`   | Doctor | Get doctor's appointments      |
| GET    | `/incoming`       | Doctor | Get upcoming appointments      |
| GET    | `/dashboard`      | Doctor | Earnings + stats               |
| POST   | `/complete`       | Doctor | Mark appointment as completed  |
| POST   | `/cancel`         | Doctor | Cancel appointment             |
| PUT    | `/update-profile` | Doctor | Update doctor profile + image  |

#### POST `/api/doctor/login`
```json
// request body
{
  "email": "doctor@dentacare.com",
  "password": "DentaCareDoc123"
}

// response
{
  "success": true,
  "dtoken": "eyJ...",
  "doctor": {
    "_id": "...",
    "name": "Dr. Smith",
    "speciality": "Dentist",
    "fees": 50
  }
}
```

#### GET `/api/doctor/dashboard`
```json
// headers: dtoken: eyJ...

// response
{
  "success": true,
  "dashboard": {
    "stats": {
      "totalAppointments": 20,
      "completedAppointments": 15,
      "cancelledAppointments": 2,
      "pendingAppointments": 3,
      "totalEarnings": 750
    },
    "upcomingAppointments": [...],
    "doctor": { "name": "...", "speciality": "...", "fees": 50 }
  }
}
```

#### POST `/api/doctor/complete`
```json
// headers: dtoken: eyJ...
// request body
{
  "appointmentId": "appointment_id"
}
```

#### POST `/api/doctor/cancel`
```json
// headers: dtoken: eyJ...
// request body
{
  "appointmentId": "appointment_id",
  "reason": "Optional reason"
}
```

---

### Appointment Routes — `/api/appointment`

| Method | Endpoint  | Auth    | Description                    |
|--------|-----------|---------|--------------------------------|
| POST   | `/book`   | Patient | Book an appointment            |
| GET    | `/list`   | Patient | Get patient's appointments     |
| POST   | `/cancel` | Patient | Cancel appointment             |

#### POST `/api/appointment/book`
```json
// headers: token: eyJ...
// request body
{
  "docId": "doctor_id",
  "slotDate": "28_4_2026",
  "slotTime": "10:00"
}

// response
{
  "success": true,
  "message": "Appointment created successfully"
}
```

#### POST `/api/appointment/cancel`
```json
// headers: token: eyJ...
// request body
{
  "appointmentId": "appointment_id"
}
```

---

### Payment Routes — `/api/payment`

| Method | Endpoint             | Auth    | Description                     |
|--------|----------------------|---------|---------------------------------|
| POST   | `/stripe-checkout`   | Patient | Create Stripe checkout session  |
| POST   | `/stripe-verify`     | Patient | Verify Stripe payment           |
| POST   | `/chargily-checkout` | Patient | Create Chargily checkout (DZD)  |
| POST   | `/chargily-verify`   | Patient | Verify Chargily payment         |

#### POST `/api/payment/stripe-checkout`
```json
// headers: token: eyJ...
// request body
{
  "appointmentId": "appointment_id"
}

// response
{
  "success": true,
  "sessionUrl": "https://checkout.stripe.com/..."
}
```

#### POST `/api/payment/stripe-verify`
```json
// request body
{
  "sessionId": "cs_test_..."
}

// response
{
  "success": true,
  "message": "Payment verified successfully"
}
```

#### POST `/api/payment/chargily-checkout`
```json
// headers: token: eyJ...
// request body
{
  "appointmentId": "appointment_id"
}

// response
{
  "success": true,
  "checkoutUrl": "https://pay.chargily.net/..."
}
```

---

### Review Routes — `/api/review`

| Method | Endpoint   | Auth    | Description                              |
|--------|------------|---------|------------------------------------------|
| POST   | `/add`     | Patient | Add review (completed appointment only)  |
| GET    | `/:docId`  | None    | Get all reviews for a doctor             |

#### POST `/api/review/add`
```json
// headers: token: eyJ...
// request body
{
  "docId": "doctor_id",
  "rating": 5,
  "comment": "Excellent doctor, very professional"
}
```

#### GET `/api/review/:docId`
```json
// response
{
  "success": true,
  "reviews": [...],
  "avgRating": 4.8,
  "totalReviews": 12
}
```

---

## Data Models

### User (Patient)
```
name, email, password (hashed), role (patient/admin),
image, dob, gender, phone, address { line1, line2 }
```

### Doctor
```
name, email, password (hashed), image (Cloudinary),
speciality, degree, experience, about, available,
fees, address, slots_booked (Object), date
```

### Appointment
```
userId, docId, slotDate, slotTime,
userData (snapshot), docData (snapshot),
amount, date, cancelled, isPaid, isCompleted,
stripeSessionId, chargilyCheckoutId,
paymentIntentId, paymentDate,
cancellationReason, cancellationBy
```

### Review
```
userId, docId, rating (1-5), comment, date
```

---

## Key Design Decisions

**Snapshot pattern on appointments** — userData and docData are stored as full snapshots at booking time. If a doctor changes their fees later, existing appointments still show the original price.

**slots_booked as an Object** — stored directly on the Doctor document as `{ "28_4_2026": ["10:00", "11:00"] }`. No separate collection needed — availability check is a single document read.

**Three separate auth systems** — patient, doctor, and admin each have their own JWT middleware and header key. A doctor token cannot access patient routes and vice versa.

**Dual payment gateway** — Stripe for international cards, Chargily for Algerian CIB and Edahabia cards. Both gateways mark the same `isPaid` field on the appointment.

**Review gate** — patients can only review a doctor after a completed, non-cancelled appointment with that specific doctor. One review per doctor per patient.

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## License

MIT