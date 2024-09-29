import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  searchReviews
} from '../controllers/reviewController';

const router = express.Router();

router.get('/:movieId', getReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.get('/',searchReviews)

export default router;
