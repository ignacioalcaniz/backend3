# Proyecto Adoption API

API para la gestión de adopciones de mascotas, desarrollada con Node.js y Express.

---

## 📋 Descripción

Esta aplicación permite manejar usuarios, adopciones y otros recursos relacionados con el proceso de adopción de mascotas. Incluye documentación Swagger para el módulo de Users y tests funcionales para el router `adoption.router.js`.

---

## 🚀 Tecnologías usadas

- Node.js  
- Express  
- MongoDB  
- Docker  
- Jest / Supertest (para tests funcionales)  
- Swagger (para documentación API)

---

## 📁 Estructura del proyecto

/src
/routes
- adoption.router.js
- users.router.js
/controllers
/models
/tests
/docs
Dockerfile
README.md
package.json

yaml
Copiar
Editar

---

## 🐳 Docker

La imagen del proyecto está disponible en Docker Hub:

👉 [https://hub.docker.com/r/ignacioalcaniz/proyecto](https://hub.docker.com/r/ignacioalcaniz/proyecto)

### Cómo usarla

1. Descargar la imagen:

```bash
docker pull ignacioalcaniz/proyecto
Ejecutar el contenedor, mapeando el puerto 3500 (ajustá si usás otro puerto):

bash
Copiar
Editar
docker run -p 3500:3500 ignacioalcaniz/proyecto
Acceder a la aplicación en el navegador o con herramientas REST en:

arduino
Copiar
Editar
http://localhost:3500
Nota: Asegurate que el puerto 3500 coincida con el que usa tu aplicación dentro del contenedor. Si usás otro puerto, reemplazá 3500 por el correcto.

Construir la imagen localmente
Si querés construir la imagen vos mismo, desde la raíz del proyecto ejecutá:

bash
Copiar
Editar
docker build -t ignacioalcaniz/proyecto .
📜 Documentación Swagger
La documentación del módulo Users está disponible en:

bash
Copiar
Editar
http://localhost:3500/api-docs
(o la ruta que hayas configurado)

🧪 Tests funcionales
Los tests funcionales cubren todos los endpoints del router adoption.router.js, verificando casos de éxito y errores.

Para correr los tests localmente:

bash
Copiar
Editar
npm install
npm test
⚙️ Configuración
Si usás variables de entorno, asegurate de crear un archivo .env basado en .env.example con las configuraciones necesarias (como URI de MongoDB, puerto, etc).




