import { Router } from 'express';
import { generateMockUsers } from '../services/mocking.service.js';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js';
import bcrypt from 'bcrypt';

const router = Router();


router.get('/mockingpets', (req, res) => {
  // Lógica original aquí
  res.send('Este es el endpoint de mockingpets movido al nuevo router');
});


router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50);
  res.json(users);
});


router.post('/generateData', async (req, res) => {
  const { users = 0, pets = 0 } = req.body;

  try {
    const hashedPassword = await bcrypt.hash('coder123', 10);
    const userDocs = [];

    for (let i = 0; i < users; i++) {
      userDocs.push({
        first_name: `Nombre${i}`,
        last_name: `Apellido${i}`,
        email: `user${i}@mail.com`,
        password: hashedPassword,
        role: Math.random() > 0.5 ? 'admin' : 'user',
        pets: [],
      });
    }

    const insertedUsers = await UserModel.insertMany(userDocs);

    const petDocs = [];

    for (let i = 0; i < pets; i++) {
      petDocs.push({
        name: `Pet${i}`,
        species: 'perro',
        age: Math.floor(Math.random() * 10 + 1),
        owner: insertedUsers[i % insertedUsers.length]._id,
      });
    }

    const insertedPets = await PetModel.insertMany(petDocs);

    res.json({
      message: 'Datos generados e insertados con éxito',
      usersInserted: insertedUsers.length,
      petsInserted: insertedPets.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar datos' });
  }
});

export default router;