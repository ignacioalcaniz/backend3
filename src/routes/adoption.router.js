import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adoptions
 *   description: Endpoints de adopción de mascotas
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Listar todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Array de adopciones
 */
router.get('/', async (req, res) => {
  const adoptions = await PetModel.find().populate('owner');
  res.json(adoptions);
});

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Registrar una adopción (asignar userId a petId)
 *     tags: [Adoptions]
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
 *     responses:
 *       201:
 *         description: Adopción creada
 *       400:
 *         description: Datos faltantes
 *       404:
 *         description: Usuario o mascota no encontrados
 */
router.post('/', async (req, res) => {
  const { userId, petId } = req.body;
  if (!userId || !petId) return res.status(400).json({ error: 'userId y petId son requeridos' });

  const user = await UserModel.findById(userId);
  const pet = await PetModel.findById(petId);
  if (!user || !pet) return res.status(404).json({ error: 'Usuario o mascota no encontrado' });

  pet.owner = user._id;
  await pet.save();

  user.pets.push(pet._id);
  await user.save();

  res.status(201).json({ message: 'Adopción registrada', pet });
});

export default router;
