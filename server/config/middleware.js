const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config'); // Asegúrate de que esta ruta sea correcta

// Middleware para verificar el token JWT en rutas protegidas
const checkJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Cabecera de autorización completa:", authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        console.log("Token recibido:", token);


        jwt.verify(token, jwtSecret, (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Token inválido o expirado.' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }
};

// Función para configurar middleware de Express
const configureMiddleware = (app) => {
    app.use(cors()); // Usa CORS sin restricciones específicas para desarrollo
    app.use(express.json()); // Para analizar solicitudes JSON
    app.use('/uploads', express.static('uploads')); // Sirve archivos estáticos desde 'uploads'
};

module.exports = {
    configureMiddleware,
    checkJwt
};
