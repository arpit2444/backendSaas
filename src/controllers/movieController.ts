import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { Review } from '../models/Review';

export const getMovies = async (req: Request, res: Response) => {

    const searchQuery = req.query.search || ''; 
    try {
      const movies = await Movie.find({ 
        name: { $regex: searchQuery, $options: 'i' }
      });
      res.status(200).json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ message: 'Error fetching movies' });
    }
  
};

export const createMovie = async (req: Request, res: Response) => {
  const { name, releaseDate } = req.body;
  try {
    const newMovie = new Movie({ name, releaseDate });
    await newMovie.save();
    res.json(newMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie' });
  }
};

export const getSingleMovie = async (req: Request, res: Response) => {

  const id = req.params.id;
  try {
    const movies = await Movie.findById(id)
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }

};

export const editMovies = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating movie' });
  }
}

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (movie) {
      await Review.deleteMany({ movieId: movie._id });
      res.json({ message: 'Movie and reviews deleted' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie' });
  }
};
