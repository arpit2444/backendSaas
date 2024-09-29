import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  averageRating: { type: Number, default: null },
});

export const Movie = mongoose.model('Movie', movieSchema);
