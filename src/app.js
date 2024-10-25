import express from 'express'
import { saveDataFromCSV } from './utils/save-data-csv.js'
import routes from './routes/routes.js'
import { getConnection } from './database/connection.js'

const app = express()
app.use(express.json())
app.use(routes)

let server

async function runServer() {
  try {
    await getConnection()
    await saveDataFromCSV()
    server = app.listen(3000, async () => {
      process.env.NODE_ENV !== 'test' ? console.log('Running Server 3000') : null
    })
  } catch (error) {
    console.log(error)
  }
}

async function closeServer() {
  if (server) {
    await new Promise(resolve => server.close(resolve)); // Fecha o servidor
  }
}


runServer()



export { app, closeServer, server, runServer };