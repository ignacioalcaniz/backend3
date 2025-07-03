import { Router } from 'express';
import { generateMockUsers } from '../services/mocking.service.js';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js';
import bcrypt from 'bcrypt';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados con usuarios y mascotas mock
 */

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Endpoint de prueba para mockingpets
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Mensaje de prueba
 */
router.get('/mockingpets', (req, res) => {
  res.send('Este es el endpoint de mockingpets movido al nuevo router');
});

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Genera una lista de usuarios falsos para pruebas (mock)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios generados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50);
  res.json(users);
});

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera datos reales de usuarios y mascotas en MongoDB
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 example: 10
 *               pets:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Datos generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usersInserted:
 *                   type: integer
 *                 petsInserted:
 *                   type: integer
 *       500:
 *         description: Error al generar datos
 */
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

    // Relacionar mascotas con usuarios
    for (const pet of insertedPets) {
      await UserModel.findByIdAndUpdate(pet.owner, {
        $push: { pets: pet._id }
      });
    }

    res.json({
      message: 'Datos generados e insertados con éxito',
      usersInserted: insertedUsers.length,
      petsInserted: insertedPets.length,
    });
  } catch (error) {
    console.error('❌ Error al generar datos:', error);
    res.status(500).json({ error: 'Error al generar datos' });
  }
});

export default router;
