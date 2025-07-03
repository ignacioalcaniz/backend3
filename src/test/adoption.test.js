import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../src/models/user.model.js';
import { PetModel } from '../src/models/pet.model.js';

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Endpoints /api/adoptions', () => {
  let user, pet;
  beforeEach(async () => {
    await UserModel.deleteMany();
    await PetModel.deleteMany();
    user = await UserModel.create({ first_name: 'A', last_name:'B', email:'a@b.com', password:'x', pets:[] });
    pet = await PetModel.create({ name:'Pi', species:'dog', age:3 });
  });

  it('GET /api/adoptions → OK y array', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/adoptions → registro adopción', async () => {
    const res = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: pet._id.toString() });
    expect(res.status).toBe(201);
    expect(res.body.pet.owner).toBe(user._id.toString());
  });

  it('POST sin datos → error 400', async () => {
    const res = await request(app).post('/api/adoptions').send({});
    expect(res.status).toBe(400);
  });

  it('POST ids inválidos → 404', async () => {
    const res = await request(app)
      .post('/api/adoptions')
      .send({ userId: mongoose.Types.ObjectId(), petId: mongoose.Types.ObjectId() });
    expect(res.status).toBe(404);
  });
});
