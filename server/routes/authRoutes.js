const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

// Middleware para validar los resultados de las validaciones
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/register', [
    // Definir validaciones para el registro
    body('username', 'El nombre de usuario debe tener al menos 5 caracteres').isLength({ min: 5 }),
    body('email', 'Debe ser un correo electrónico válido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validate // Usar el middleware de validación
], register);

router.post('/login', [
    // Definir validaciones para el login
    body('username', 'El nombre de usuario es requerido').notEmpty(),
    body('password', 'La contraseña es requerida').notEmpty(),
    validate // Usar el middleware de validación
], login);

module.exports = router;
