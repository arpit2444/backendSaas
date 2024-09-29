import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Movie } from '../models/Movie';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const { movieId, reviewerName, rating, comments } = req.body;
  try {
    const newReview = new Review({ movieId, reviewerName, rating, comments });
    await newReview.save();

    const reviews = await Review.find({ movieId });
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2))
      : 0;

    await Movie.findByIdAndUpdate(movieId, { averageRating: avgRating });

    res.json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
};


export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    const reviews = await Review.find({ movieId: updatedReview.movieId });
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2))
      : 0;

    await Movie.findByIdAndUpdate(updatedReview.movieId, { averageRating: avgRating });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    const reviews = await Review.find({ movieId: deletedReview.movieId });
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2))
      : 0;

    await Movie.findByIdAndUpdate(deletedReview.movieId, { averageRating: avgRating });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};




export const searchReviews = async (req: Request, res: Response): Promise<void> => {
  const { term } = req.query;

  if (!term) {
    res.status(400).json({ message: 'Search term is required' })
    return;
    
  }

  try {
    const reviews = await Review.find({
      $or: [
        { reviewerName: { $regex: term, $options: 'i' } },
        { comments: { $regex: term, $options: 'i' } }
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
