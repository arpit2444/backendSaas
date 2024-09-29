import express from 'express';
import { getMovies, createMovie, deleteMovie,editMovies,getSingleMovie } from '../controllers/movieController';

const router = express.Router();

router.get('/', getMovies);
router.post('/', createMovie);

router.put('/:id', editMovies);

router.get('/:id',getSingleMovie)
  

router.delete('/:id', deleteMovie);

export default router;
