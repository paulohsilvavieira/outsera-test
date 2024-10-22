import server from '../src/app.js';
import request from 'supertest';
import { createTables } from '../src/database/create-tables.js';
import { saveDataFromCSV } from '../src/utils/read-csv.js';

describe('Producers Routes', () => {

  beforeAll(async () => {
    await createTables()
  });

  afterAll((done) => {
    server.close();
    done();

  });

  describe('POST /producers', () => {
    test('Created - 201', async () => {
      const response = await request(server).post('/producers').send({
        name: "test producer"
      });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        location: expect.any(String),
      });
    });



    test('Bad Request - 400', async () => {
      const response = await request(server).post('/producers').send();
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
      const responseCreateProducers = await request(server).post('/Producers').send(body);

      const response = await request(server).get(
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

      const response = await request(server).get(`/producers`);

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

      const responseAllProducers = await request(server).get(`/producers`);

      const producer = responseAllProducers.body[0];
      const response = await request(server)
        .put(`/producers/${producer.id}`)
        .send({
          name: 'Bruce Wayne 2',
        });

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual({});

      const resonseProducerUpdated = await request(server).get(
        `/producers/${producer.id}`
      );
      expect(resonseProducerUpdated.body.name).toEqual('Bruce Wayne 2');
    });
    test('Bad Request - StatusCode 400', async () => {

      const responseAllProducers = await request(server).get(`/producers`);

      const producer = responseAllProducers.body[0];
      const response = await request(server)
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

      const responseAllProducers = await request(server).get(`/producers`);
      const producer = responseAllProducers.body[0];


      const response = await request(server)
        .delete(`/producers/${producer.id}`)


      expect(response.statusCode).toEqual(204);

      const producerDeletedResponse = await request(server)
        .get(
          `/producers/${producer.id}`
        );
      expect(producerDeletedResponse.body).toEqual({});
    });
  });

  describe('Get Interval Awards', () => {
    test('Status OK - StatusCode 200', async () => {

      const response = await request(server).get(`/producers/award/interval`);

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
