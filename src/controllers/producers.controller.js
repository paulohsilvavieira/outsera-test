import { saveProducer, updateProducer, getProducerById, getproducers, deleteProducer, getIntervalAward } from '../database/producers.repository.js'

export class ProducersController {
  create = async (request, response) => {
    try {

      const { errors, isValid } = this.validator(request.body)

      if (!isValid) {
        return response.status(400).json({
          errors,
        });
      }
      const name = request.body.name
      const producerId = await saveProducer(name);
      return response.status(201).json({
        location: `/producers/${producerId}`
      })
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  update = async (request, response) => {
    try {

      const { errors, isValid } = this.validator(request.body)

      if (!isValid) {
        return response.status(400).json({
          errors,
        });
      }
      const name = request.body.name
      const id = request.params.id
      await updateProducer(id, name);
      return response.status(204).json({})
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  delete = async (request, response) => {
    try {
      const id = request.params.id
      await deleteProducer(id);
      return response.status(204).json({})
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  get = async (request, response) => {
    try {
      const producerId = request.params.id
      const producer = await getProducerById(producerId);
      return response.status(200).json(
        producer ?? {}
      )
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  getAll = async (request, response) => {
    try {
      const producers = await getproducers();
      return response.status(200).json(producers)
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }
  awardInterval = async (request, response) => {
    try {
      const intervalAward = await getIntervalAward();
      return response.status(200).json({
        min: [...intervalAward.slice(0, 2)],
        max: [...intervalAward.slice(-2)]

      })
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  validator = (fields) => {
    const requiredFields = ['name']


    const errors = []


    for (const field of requiredFields) {
      if (!Object.keys(fields).includes(field)) {
        errors.push(`${field} is required!`)
      }
    }

    return {
      isValid: errors.length === 0 ? true : false,
      errors
    };

  }
}