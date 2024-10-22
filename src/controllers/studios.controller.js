import { saveStudio, getStudioById, getStudios, deleteStudio, updateStudio } from '../database/studios.repository.js'

export class StudiosController {
  create = async (request, response) => {

    try {
      const { errors, isValid } = this.validator(request.body)

      if (!isValid) {
        return response.status(400).json({
          errors,
        });
      }
      const name = request.body.name;
      const studioId = await saveStudio(name)
      return response.status(201).json({
        location: `/studios/${studioId}`
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
      await updateStudio(id, name);
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
      await deleteStudio(id);
      return response.status(204).json({})
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  get = async (request, response) => {
    try {
      const StudioId = request.params.id
      const studio = await getStudioById(StudioId);
      return response.status(200).json(studio ?? {})
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }
  }

  getAll = async (request, response) => {
    try {
      const studios = await getStudios();
      return response.status(200).json(studios)
    } catch (error) {
      return response.status(500).json({
        msg: 'Internal Server Error'
      })
    }

  }
  validator = (movieData, movieId = undefined) => {
    let requiredFields = ['name']


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