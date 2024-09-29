import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  reviewerName: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, max: 10 },
  comments: { type: String, required: true },
});

export const Review = mongoose.model('Review', reviewSchema);
