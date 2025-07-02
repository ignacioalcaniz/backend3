// src/routes/adoption.router.js
import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js';

const router = Router();

// Array en memoria para registrar adopciones
const adoptions = [];

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Registrar una nueva adopción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               petId:
 *                 type: string
 *             required:
 *               - userId
 *               - petId
 *     responses:
 *       201:
 *         description: Adopción registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Usuario o mascota no encontrado
 *       500:
 *         description: Error interno
 */
router.post('/', async (req, res) => {
  try {
    const { userId, petId } = req.body;
    const user = await UserModel.findById(userId);
    const pet = await PetModel.findById(petId);

    if (!user || !pet) return res.status(404).json({ error: 'User or Pet not found' });

    if (pet.owner && pet.owner.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'Pet already adopted by this user' });
    }

    pet.owner = user._id;
    await pet.save();

    user.pets.push(pet._id);
    await user.save();

    const newAdoption = { 
      id: adoptions.length + 1, 
      userId: user._id.toString(), 
      petId: pet._id.toString(), 
      date: new Date().toISOString() 
    };
    adoptions.push(newAdoption);

    res.status(201).json(newAdoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Listar todas las adopciones
 *     responses:
 *       200:
 *         description: Lista de adopciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/Adoption'
 */
router.get('/', (req, res) => {
  res.json(adoptions);
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   delete:
 *     summary: Cancelar una adopción
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Adopción cancelada y datos revertidos
 *       404:
 *         description: Adopción no encontrada
 */
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = adoptions.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Adoption not found' });

  const [deleted] = adoptions.splice(index, 1);

  try {
    const user = await UserModel.findById(deleted.userId);
    const pet = await PetModel.findById(deleted.petId);

    if (user && pet) {
      user.pets = user.pets.filter(p => p.toString() !== pet._id.toString());
      await user.save();

      pet.owner = null;
      await pet.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
