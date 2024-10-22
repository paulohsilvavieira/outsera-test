import server from '../src/app';
import request from 'supertest';
import { createTables } from '../src/database/create-tables';
import { saveDataFromCSV } from '../src/utils/read-csv';
// let server;
describe('Movies Routes', () => {

  beforeAll(async () => {
    await createTables()
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });
  describe('POST /movies', () => {
    test('Created - 201', async () => {
      const response = await request(server).post('/movies').send({
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
      const response = await request(server).post('/movies').send({
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
      const responseCreateMovie = await request(server).post('/movies').send(body);
      const response = await request(server).get(
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

      const response = await request(server).get(`/movies`);

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

      const responseAllMovies = await request(server).get(`/movies`);

      const movie = responseAllMovies.body[0];
      const response = await request(server)
        .put(`/movies/${movie.movie_id}`)
        .send({
          title: 'New Name moive',
          winner: true,
          year: 2099,
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const responseMovieUpdated = await request(server).get(
        `/movies/${movie.movie_id}`
      );
      expect(responseMovieUpdated.body.title).toEqual('New Name moive');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllMovies = await request(server).get(`/movies`);

      const movie = responseAllMovies.body[0];
      const response = await request(server)
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

      const responseAllMovies = await request(server).get(`/movies`);
      const movie = responseAllMovies.body[0];


      const response = await request(server)
        .delete(`/movies/${movie.movie_id}`)
        .send({
          title: 'New Name moive',
          winner: true,
          year: 2099,
        });

      expect(response.statusCode).toEqual(204);

      const movieDeletedResponse = await request(server)
        .get(
          `/movies/${movie.movie_id}`
        );
      expect(movieDeletedResponse.body).toEqual({});
    });
  });
});
