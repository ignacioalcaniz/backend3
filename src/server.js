import express from 'express';
import mongoose from 'mongoose';
import mocksRouter from './routes/mocks.router.js';

const app = express();
app.use(express.json());

app.use('/api/mocks', mocksRouter);

await mongoose.connect('mongodb://localhost:27017/backend3');

app.listen(3000, () => console.log('Servidor escuchando en puerto 3000'));