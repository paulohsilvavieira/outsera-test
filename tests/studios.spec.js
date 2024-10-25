import { app, closeServer, server } from '../src/app.js';
import request from 'supertest';
import { getConnection } from '../src/database/connection.js';
import { saveDataFromCSV } from '../src/utils/save-data-csv.js';
describe('Studios Routes', () => {
  beforeAll(async () => {
    await getConnection()
    await saveDataFromCSV()
  });

  afterEach(async () => {
    await closeServer()
  });

  describe('POST /studios', () => {
    test('Created - 201', async () => {
      const response = await request(app)
        .post('/studios')
        .send({
          name: `studio ${Date.now()}`
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        location: expect.any(String),
      });
    });



    test('Bad Request - 400', async () => {
      const response = await request(app).post('/studios').send();
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'name is required!'
        ]
      });
    });

  });

  describe('GET /studios/{id}', () => {
    test('OK - StatusCode 200', async () => {
      const body = {
        name: 'Wayne Studios',
      }
      const responseCreateStudios = await request(app).post('/studios').send(body);

      const response = await request(app).get(
        `${responseCreateStudios.body.location}`
      );

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Wayne Studios',
        })
      );
    })
  });
  describe('Get All Studios', () => {
    test('Status OK - StatusCode 200', async () => {
      await request(app).post('/studios').send({
        name: `studio ${Date.now()}`
      });

      const response = await request(app).get(`/studios`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),

          }),
        ])
      );
    });
  });

  describe('PUT /studios/{id}', () => {
    test('Not Content - StatusCode 204', async () => {

      const responseAllStudios = await request(app).get(`/studios`);

      const studio = responseAllStudios.body[0];
      const response = await request(app)
        .put(`/studios/${studio.id}`)
        .send({
          name: 'Wayne Studios 2',
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const resonseStudioUpdated = await request(app).get(
        `/studios/${studio.id}`
      );
      expect(resonseStudioUpdated.body.name).toEqual('Wayne Studios 2');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllStudios = await request(app).get(`/studios`);

      const studio = responseAllStudios.body[0];
      const response = await request(app)
        .put(`/studios/${studio.id}`)
        .send({});

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'name is required!',
        ]
      });
    });
  });

  describe('DELETE /studios/{id}', () => {
    test('Status Not Content - StatusCode 204', async () => {

      const responseAllStudios = await request(app).get(`/studios`);
      const studio = responseAllStudios.body[0];


      const response = await request(app)
        .delete(`/studios/${studio.id}`)


      expect(response.statusCode).toEqual(204);

      const studioDeletedResponse = await request(app)
        .get(
          `/studios/${studio.id}`
        );
      expect(studioDeletedResponse.body).toEqual({});
    });
  });
});
