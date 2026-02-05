import request from 'supertest';
import { app } from '../../src/app';
import { resetItems } from '../../src/routes/items';
import { resetUsers } from '../../src/routes/users';

describe('E2E: Full API Flow', () => {
  beforeEach(() => {
    resetItems();
    resetUsers();
  });

  it('should handle complete user and items workflow', async () => {
    // Create user
    const userRes = await request(app)
      .post('/api/users')
      .send({ email: 'shop@test.com', name: 'Shop Owner', role: 'admin' });
    expect(userRes.status).toBe(201);
    const userId = userRes.body.data.id;

    // Create multiple items
    const items = [
      { name: 'Widget', price: 10.99, quantity: 100 },
      { name: 'Gadget', price: 24.99, quantity: 50 },
      { name: 'Gizmo', price: 5.99, quantity: 200 },
    ];

    for (const item of items) {
      const res = await request(app).post('/api/items').send(item);
      expect(res.status).toBe(201);
    }

    // List all items
    const listRes = await request(app).get('/api/items');
    expect(listRes.body.total).toBe(3);

    // Update an item
    const updateRes = await request(app)
      .patch('/api/items/1')
      .send({ price: 12.99 });
    expect(updateRes.body.data.price).toBe(12.99);

    // Delete an item
    await request(app).delete('/api/items/2');
    
    // Verify deletion
    const finalList = await request(app).get('/api/items');
    expect(finalList.body.total).toBe(2);

    // Check user still exists
    const userCheck = await request(app).get(`/api/users/${userId}`);
    expect(userCheck.status).toBe(200);
  });

  it('should handle errors gracefully', async () => {
    // Non-existent resource
    const notFound = await request(app).get('/api/items/999');
    expect(notFound.status).toBe(404);
    expect(notFound.body).toHaveProperty('message');

    // Invalid data
    const invalid = await request(app)
      .post('/api/items')
      .send({ name: '' });
    expect(invalid.status).toBe(400);

    // Non-existent route
    const noRoute = await request(app).get('/api/nonexistent');
    expect(noRoute.status).toBe(404);
  });
});
