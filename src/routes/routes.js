import { Router } from 'express'
import { MoviesController } from '../controllers/movies.controller.js'
import { StudiosController } from '../controllers/studios.controller.js'

import { ProducersController } from '../controllers/producers.controller.js'

const router = Router()

const movieController = new MoviesController()
const studioController = new StudiosController()
const producerController = new ProducersController()

router.get('/movies/:id', movieController.get)
router.get('/movies', movieController.getAllMovies)
router.post('/movies', movieController.create)
router.put('/movies/:id', movieController.update)
router.delete('/movies/:id', movieController.delete)


router.get('/studios/:id', studioController.get)
router.get('/studios', studioController.getAll)
router.post('/studios', studioController.create)
router.put('/studios/:id', studioController.update)
router.delete('/studios/:id', studioController.delete)

router.get('/producers/:id', producerController.get)
router.get('/producers', producerController.getAll)
router.post('/producers', producerController.create)
router.put('/producers/:id', producerController.update)
router.delete('/producers/:id', producerController.delete)

router.get('/producers/award/interval', producerController.awardInterval)

export default router;


