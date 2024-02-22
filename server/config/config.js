require('dotenv').config({path: '../.env'}); // Carga las variables de entorno del archivo .env
const jwtSecret = process.env.JWT_SECRET;
module.exports = { jwtSecret };