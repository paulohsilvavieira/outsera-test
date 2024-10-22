// read file

import csvtoJson from 'csvtojson'
import path from 'path';
import { createTables } from '../database/create-tables.js'
import { saveMovie, saveMovieProducer, saveMovieStudio } from '../database/movies.repository.js'
import { saveStudio } from '../database/studios.repository.js'
import { saveProducer } from '../database/producers.repository.js'

export async function readCSV() {
  const result = await csvtoJson({ delimiter: ';' }).fromFile(`${path.resolve()}/csv/movielist.csv`)
  return result.map((item) => {

    const regex = /\s*(?:, and |,| and )\s*/;
    const producers = [];
    const studios = [];

    const producerSplited = item.producers.split(regex)
    const studiosSplited = item.studios.split(regex)

    producerSplited.forEach(item => {
      producers.push(item)
    })
    studiosSplited.forEach(item => {
      studios.push(item)
    })
    return {
      ...item,
      winner: item.winner == 'yes' ? true : false,
      studios,
      producers,
    }
  })

}



export async function saveDataFromCSV() {
  const movies = await readCSV()
  movies.forEach(async movie => {
    const movieId = await saveMovie(movie.title, movie.year, movie.winner)
    movie.producers.forEach(async producer => {
      const producerId = await saveProducer(producer)
      await saveMovieProducer(movieId, producerId)
    })
    movie.studios.forEach(async studio => {
      const producerId = await saveStudio(studio)
      await saveMovieStudio(movieId, producerId)
    })
  })
}