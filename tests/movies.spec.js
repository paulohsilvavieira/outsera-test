import { app, closeServer } from '../src/app.js';
import request from 'supertest';
import { getConnection } from '../src/database/connection.js';
import { saveDataFromCSV } from '../src/utils/save-data-csv.js';
import { readCSV } from '../src/utils/read-csv.js';
describe('Movies Routes', () => {


  beforeAll(async () => {
    await getConnection()
    await saveDataFromCSV()
  });

  afterAll(async () => {
    await closeServer()
  })

  describe('CSV Files', () => {
    test('Validate CSV values', async () => {
      const csvData = await readCSV()

      const response = await request(app).get('/movies')
      const movies = response.body.map(movie => {
        const { movie_id, movie_data } = movie
        return {
          ...movie_data
        }
      })

      expect(csvData).toEqual(movies);

    })
  })

  describe('POST /movies', () => {
    test('Created - 201', async () => {
      const response = await request(app).post('/movies').send({
        title: 'any title',
        producers: 'producer1, producer2',
        year: 2025,
        winner: false,
        studios: 'studio1, studio2',
      });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        location: expect.any(String),
      });
    });



    test('Bad Request - 400', async () => {
      const response = await request(app).post('/movies').send({
        title: 'any title',

      });
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'year is required!',
          'winner is required!',
          'studios is required!',
          'producers is required!'
        ]
      });
    });

  });

  describe('GET /movies/{id}', () => {
    test('OK - StatusCode 200', async () => {
      const body = {
        title: `any title ${Date.now()}`,
        producers: 'producer1, producer2',
        winner: false,
        year: 2025,
        studios: 'studio1, studio2',
      }

      let id;
      const responseCreateMovie = await request(app)
        .post('/movies').send(body);

      id = responseCreateMovie.body.location.split('/movies/')[1]

      const response = await request(app).get(
        `${responseCreateMovie.body.location}`
      );



      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: body.title,
          winner: 'false',
          year: 2025,
        })
      );
    })
  });
  describe('Get All Movies', () => {
    test('Status OK - StatusCode 200', async () => {

      const response = await request(app).get(`/movies`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            movie_id: expect.any(Number),
            title: expect.any(String),
            producers: expect.any(String),
            winner: expect.any(String),
            year: expect.any(Number),
            studios: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('PUT /movies/{id}', () => {
    test('Not Content - StatusCode 204', async () => {

      const responseAllMovies = await request(app).get(`/movies`);

      const movie = responseAllMovies.body[0];
      const response = await request(app)
        .put(`/movies/${movie.movie_id}`)
        .send({
          title: 'New Name moive',
          winner: true,
          year: 2099,
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const responseMovieUpdated = await request(app).get(
        `/movies/${movie.movie_id}`
      );
      expect(responseMovieUpdated.body.title).toEqual('New Name moive');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllMovies = await request(app).get(`/movies`);

      const movie = responseAllMovies.body[0];
      const response = await request(app)
        .put(`/movies/${movie.movie_id}`)
        .send({
          title: 'New Name moive',

        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'year is required!',
          'winner is required!',
        ]
      });
    });
  });

  describe('DELETE /movies/{id}', () => {
    test('Status Not Content - StatusCode 204', async () => {

      const responseAllMovies = await request(app).get(`/movies`);
      const movie = responseAllMovies.body[0];


      const response = await request(app)
        .delete(`/movies/${movie.movie_id}`)

      expect(response.statusCode).toEqual(204);

      const movieDeletedResponse = await request(app)
        .get(
          `/movies/${movie.movie_id}`
        );
      expect(movieDeletedResponse.body).toEqual({});
    });
  });
});
