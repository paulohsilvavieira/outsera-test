import { app, closeServer } from '../src/app.js';
import request from 'supertest';
import { getConnection } from '../src/database/connection.js';
import { saveDataFromCSV } from '../src/utils/save-data-csv.js';

describe('Producers Routes', () => {

  beforeAll(async () => {
    await getConnection()
    await saveDataFromCSV()
  });
  afterEach(async () => {
    await closeServer()
  });




  describe('POST /producers', () => {
    test('Created - 201', async () => {
      const response = await request(app).post('/producers').send({
        name: "test producer"
      });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        location: expect.any(String),
      });
    });



    test('Bad Request - 400', async () => {
      const response = await request(app).post('/producers').send();
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'name is required!'
        ]
      });
    });

  });

  describe('GET /producers/{id}', () => {
    test('OK - StatusCode 200', async () => {
      const body = {
        name: 'Bruce Wayne',

      }
      const responseCreateProducers = await request(app).post('/Producers').send(body);

      const response = await request(app).get(
        `${responseCreateProducers.body.location}`
      );

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Bruce Wayne',
        })
      );
    })
  });
  describe('Get All Producers', () => {
    test('Status OK - StatusCode 200', async () => {

      const response = await request(app).get(`/producers`);

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

  describe('PUT /producers/{id}', () => {
    test('Not Content - StatusCode 204', async () => {

      const responseAllProducers = await request(app).get(`/producers`);

      const producer = responseAllProducers.body[0];
      const response = await request(app)
        .put(`/producers/${producer.id}`)
        .send({
          name: 'Bruce Wayne 2',
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const resonseProducerUpdated = await request(app).get(
        `/producers/${producer.id}`
      );
      expect(resonseProducerUpdated.body.name).toEqual('Bruce Wayne 2');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllProducers = await request(app).get(`/producers`);

      const producer = responseAllProducers.body[0];
      const response = await request(app)
        .put(`/producers/${producer.id}`)
        .send({


        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        errors: [
          'name is required!',
        ]
      });
    });
  });

  describe('DELETE /producers/{id}', () => {
    test('Status Not Content - StatusCode 204', async () => {

      const responseAllProducers = await request(app).get(`/producers`);
      const producer = responseAllProducers.body[0];


      const response = await request(app)
        .delete(`/producers/${producer.id}`)


      expect(response.statusCode).toEqual(204);

      const producerDeletedResponse = await request(app)
        .get(
          `/producers/${producer.id}`
        );
      expect(producerDeletedResponse.body).toEqual({});
    });
  });

  describe('Get Interval Awards', () => {
    test('Status OK - StatusCode 200', async () => {

      const response = await request(app).get(`/producers/award/interval`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        min: expect.arrayContaining([
          expect.objectContaining({
            producer: expect.any(String),
            interval: expect.any(Number),
            previousWin: expect.any(Number),
            followingWin: expect.any(Number),

          }),
        ]),
        max: expect.arrayContaining([
          expect.objectContaining({
            producer: expect.any(String),
            interval: expect.any(Number),
            previousWin: expect.any(Number),
            followingWin: expect.any(Number),
          }),
        ])
      }

      );
    });
  });
});
