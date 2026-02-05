import request from 'supertest';
import { app } from '../../src/app';
import { resetUsers } from '../../src/routes/users';

describe('Users API', () => {
  beforeEach(() => {
    resetUsers();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const user = { email: 'test@example.com', name: 'Test User' };
      const response = await request(app).post('/api/users').send(user);
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.role).toBe('user');
    });

    it('should validate email format', async () => {
      const response = await request(app).post('/api/users').send({ email: 'invalid', name: 'Test' });
      expect(response.status).toBe(400);
    });

    it('should prevent duplicate emails', async () => {
      const user = { email: 'test@example.com', name: 'Test' };
      await request(app).post('/api/users').send(user);
      const response = await request(app).post('/api/users').send(user);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should filter users by role', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: 'admin@test.com', name: 'Admin', role: 'admin' });
      await request(app)
        .post('/api/users')
        .send({ email: 'user@test.com', name: 'User', role: 'user' });
      const response = await request(app).get('/api/users?role=admin');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].role).toBe('admin');
    });
  });
});
