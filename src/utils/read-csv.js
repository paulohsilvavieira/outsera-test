
import csvtoJson from 'csvtojson'
import path from 'path';

export async function readCSV() {

  const result = await csvtoJson({ delimiter: ';' })
    .fromFile(`${path.resolve()}/csv/movielist.csv`)
  return result.map((item) => {

    const regex = /\s*(?:, and |,| and )\s*/;

    const producers = item.producers.split(regex).sort().join(',')
    const studios = item.studios.split(regex).sort().join(',')
    return {
      ...item,
      studios,
      producers,
    }
  })


}

