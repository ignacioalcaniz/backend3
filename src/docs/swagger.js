import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend de Mascotas',
      version: '1.0.0',
      description: 'API para manejo de usuarios, mascotas y adopciones'
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user','admin'] },
            pets: { type: 'array', items: { type: 'string' } },
          }
        },
        Pet: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            species: { type: 'string' },
            age: { type: 'integer' },
            owner: { type: 'string', nullable: true },
          }
        },
        Adoption: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'string' },
            petId: { type: 'string' },
            date: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

