import { saveMovie, saveMovieProducer, saveMovieStudio } from "../database/movies.repository.js"
import { saveProducer } from "../database/producers.repository.js"
import { saveStudio } from "../database/studios.repository.js"
import { readCSV } from "./read-csv.js"


export async function saveDataFromCSV() {
  const movies = await readCSV()
  for (const movie of movies) {
    const movieId = await saveMovie(movie.title, movie.year, movie.winner === 'yes' ? true : false)
    for (const producer of movie.producers.split(',')) {
      const producerId = await saveProducer(producer)
      await saveMovieProducer(movieId, producerId)
    }
    for (const studio of movie.studios.split(',')) {
      const producerId = await saveStudio(studio)
      await saveMovieStudio(movieId, producerId)
    }
  }
}