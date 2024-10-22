import express from 'express'
import { saveDataFromCSV } from './utils/read-csv.js'
import routes from './routes/routes.js'
import { createTables } from './database/create-tables.js'
const app = express()
app.use(express.json())
app.use(routes)


createTables().then(async () => {
  await saveDataFromCSV()
})

const server = app.listen(3000, async () => {
  process.env.NODE_ENV !== 'test' ? console.log('Running Server 3000') : null
})

export default server;