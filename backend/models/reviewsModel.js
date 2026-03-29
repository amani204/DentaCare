import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  docId:   { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date:    { type: Number, required: true }
}, { timestamps: true });

// Ensure one review per appointment
reviewSchema.index({ appointment: 1 }, { unique: true });
const Review =  mongoose.model.Review || mongoose.model('Review', reviewSchema);
export default Review ; 