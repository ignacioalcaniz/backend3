import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import adoptionRouter from '../src/routes/adoption.router.js';
import { UserModel } from '../src/models/user.model.js';
import { PetModel } from '../src/models/pet.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = express();
  app.use(express.json());
  app.use('/api/adoptions', adoptionRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Router Adoption', () => {
  let user, pet;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});

    user = await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@mail.com',
      password: 'pass',
      role: 'user',
      pets: []
    });

    pet = await PetModel.create({
      name: 'Sparky',
      species: 'dog',
      age: 3,
      owner: null
    });
  });

  test('POST /api/adoptions crea adopción correctamente', async () => {
    const res = await request(app).post('/api/adoptions').send({
      userId: user._id.toString(),
      petId: pet._id.toString()
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.userId).toBe(user._id.toString());
    expect(res.body.petId).toBe(pet._id.toString());
  });

  test('GET /api/adoptions devuelve array', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /api/adoptions/:id elimina adopción y revierte relaciones', async () => {
    const post = await request(app).post('/api/adoptions').send({
      userId: user._id.toString(),
      petId: pet._id.toString()
    });
    const id = post.body.id;
    const petAfter = await PetModel.findById(pet._id);
    expect(petAfter.owner.toString()).toBe(user._id.toString());

    const del = await request(app).delete(`/api/adoptions/${id}`);
    expect(del.status).toBe(200);
    const petAfterDel = await PetModel.findById(pet._id);
    expect(petAfterDel.owner).toBeNull();
  });
});