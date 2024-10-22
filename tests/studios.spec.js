import server from '../src/app.js';
import request from 'supertest';
import { createTables } from '../src/database/create-tables.js';
describe('Studios Routes', () => {

  beforeAll(async () => {
    await createTables()
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  describe('POST /studios', () => {
    test('Created - 201', async () => {
      const response = await request(server)
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
      const response = await request(server).post('/studios').send();
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
      const responseCreateStudios = await request(server).post('/studios').send(body);

      const response = await request(server).get(
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
      await request(server).post('/studios').send({
        name: `studio ${Date.now()}`
      });

      const response = await request(server).get(`/studios`);

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

      const responseAllStudios = await request(server).get(`/studios`);

      const studio = responseAllStudios.body[0];
      const response = await request(server)
        .put(`/studios/${studio.id}`)
        .send({
          name: 'Wayne Studios 2',
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const resonseStudioUpdated = await request(server).get(
        `/studios/${studio.id}`
      );
      expect(resonseStudioUpdated.body.name).toEqual('Wayne Studios 2');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllStudios = await request(server).get(`/studios`);

      const studio = responseAllStudios.body[0];
      const response = await request(server)
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

      const responseAllStudios = await request(server).get(`/studios`);
      const studio = responseAllStudios.body[0];


      const response = await request(server)
        .delete(`/studios/${studio.id}`)


      expect(response.statusCode).toEqual(204);

      const studioDeletedResponse = await request(server)
        .get(
          `/studios/${studio.id}`
        );
      expect(studioDeletedResponse.body).toEqual({});
    });
  });
});
