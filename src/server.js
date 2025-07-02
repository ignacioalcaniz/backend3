// src/server.js
import express from 'express';
import mongoose from 'mongoose';
import mocksRouter from './routes/mocks.router.js';
import adoptionRouter from './routes/adoption.router.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();
app.use(express.json());

app.use('/api/mocks', mocksRouter);
app.use('/api/adoptions', adoptionRouter);
setupSwagger(app);

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/backend3';

mongoose.connect(MONGO_URL)
  .then(() => console.log('🔌 Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`));
