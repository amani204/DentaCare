import express from 'express'
import { addReview, getDoctorReviews } from '../controllers/reviewController.js'
import { authPatient } from '../middleware/authMiddleware.js'

const reviewRouter = express.Router()

reviewRouter.post('/add', authPatient, addReview)
reviewRouter.get('/:docId', getDoctorReviews)

export default reviewRouter