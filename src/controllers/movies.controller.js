import { deleteMovie, getMovieById, getMovies, saveMovie, saveMovieProducer, saveMovieStudio, updateMovie } from '../database/movies.repository.js'
import { saveStudio } from '../database/studios.repository.js'
import { saveProducer } from '../database/producers.repository.js'

export class MoviesController {




  create = async (request, response) => {
    try {

      const { errors, isValid } = this.validator(request.body)

      if (!isValid) {
        return response.status(400).json({
          errors,
        });
      }
      const { title, year, winner, producers, studios } = request.body
      const movieId = await saveMovie(title, year, winner)
      const regex = /\s*(?:, and |,| and )\s*/;

      producers.split(regex).forEach(async producer => {
        const producerId = await saveProducer(producer)
        await saveMovieProducer(movieId, producerId)
      })

      studios.split(regex).forEach(async studio => {
        const studioId = await saveStudio(studio)
        await saveMovieStudio(movieId, studioId)
      })


      return response.status(201).json({
        location: `/movies/${movieId}`
      })

    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  update = async (request, response) => {
    try {
      const id = request.params.id
      const { errors, isValid } = this.validator(request.body, id)

      if (!isValid) {
        return response.status(400).json({
          errors,
        });
      }

      const { title, year, winner } = request.body
      await updateMovie(id, title, year, winner);

      return response.status(204).json({})
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  delete = async (request, response) => {
    try {
      const id = request.params.id
      await deleteMovie(id);
      return response.status(204).json({})
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  get = async (request, response) => {
    try {
      const movieId = request.params.id
      const movie = await getMovieById(movieId);
      return response.status(200).json(movie ?? {})
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  getAllMovies = async (request, response) => {
    try {
      const moviesRaw = await getMovies()]

      const movies = moviesRaw.map((movie) => {
        return {
          ...movie,
          winner: movie.winner,
          producers: movie.producers.split(',').sort().join(','),
          studios: movie.studios.split(',').sort().join(',')
        }
      })
      console.log(movies)

      return response.status(200).json(movies)
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }

  }
  validator = (movieData, movieId = undefined) => {
    let requiredFields = ['title', 'year', 'winner', 'studios', 'producers']

    if (movieId) {
      requiredFields = ['title', 'year', 'winner']
    }
    const errors = []


    for (const field of requiredFields) {
      if (!Object.keys(movieData).includes(field)) {
        errors.push(`${field} is required!`)
      }
    }

    return {
      isValid: errors.length === 0 ? true : false,
      errors
    };

  }

}