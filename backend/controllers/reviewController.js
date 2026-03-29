import Review from '../models/reviewsModel.js'
import Appointment from '../models/appointmentModel.js'

// ADD REVIEW
const addReview = async (req, res) => {
  try {
    const userId = req.userId
    const { docId, rating, comment } = req.body

    // validate fields
    if (!docId || !rating || !comment) {
      return res.json({ success: false, message: 'All fields required' })
    }

    // patient had a completed appointment with this doctor
    const appointment = await Appointment.findOne({
      userId,
      docId,
      isCompleted: true,
      cancelled:   false
    })
    if (!appointment) {
      return res.json({ success: false, message: 'You can only review a doctor after a completed appointment' })
    }

    // check patient hasn't already reviewed this doctor
    const existing = await Review.findOne({ userId, docId })
    if (existing) {
      return res.json({ success: false, message: 'You have already reviewed this doctor' })
    }

    // save review
    const review = new Review({
      userId,
      docId,
      rating:  Number(rating),
      comment,
      date:    Date.now()
    })
    await review.save()

    res.json({ success: true, message: 'Review added successfully' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// REVIEWS FOR A DOCTOR
const getDoctorReviews = async (req, res) => {
  try {
    const { docId } = req.params

    const reviews = await Review.find({ docId }).sort({ date: -1 })

    // calculate average rating
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

    res.json({
      success: true,
      reviews,
      avgRating: Number(avgRating),
      totalReviews: reviews.length
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { addReview, getDoctorReviews }