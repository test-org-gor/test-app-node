import request from 'supertest';
import { app } from '../../src/app';
import { resetItems } from '../../src/routes/items';

describe('Items API', () => {
  beforeEach(() => {
    resetItems();
  });

  describe('GET /api/items', () => {
    it('should return empty list initially', async () => {
      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const item = { name: 'Test Item', price: 9.99, quantity: 5 };
      const response = await request(app).post('/api/items').send(item);
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject(item);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should validate required fields', async () => {
      const response = await request(app).post('/api/items').send({ name: 'Test' });
      expect(response.status).toBe(400);
    });

    it('should validate price is positive', async () => {
      const response = await request(app).post('/api/items').send({ name: 'Test', price: -5 });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return item by id', async () => {
      const createRes = await request(app).post('/api/items').send({ name: 'Test', price: 10 });
      const response = await request(app).get(`/api/items/${createRes.body.data.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Test');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).get('/api/items/999');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('should update item', async () => {
      const createRes = await request(app).post('/api/items').send({ name: 'Test', price: 10 });
      const response = await request(app)
        .patch(`/api/items/${createRes.body.data.id}`)
        .send({ price: 20 });
      expect(response.status).toBe(200);
      expect(response.body.data.price).toBe(20);
      expect(response.body.data.name).toBe('Test');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete item', async () => {
      const createRes = await request(app).post('/api/items').send({ name: 'Test', price: 10 });
      const deleteRes = await request(app).delete(`/api/items/${createRes.body.data.id}`);
      expect(deleteRes.status).toBe(204);
      const getRes = await request(app).get(`/api/items/${createRes.body.data.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
