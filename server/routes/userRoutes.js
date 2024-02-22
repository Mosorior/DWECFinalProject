const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { updateUserProfileImage, updateProfileDescription, getUserProfile } = require('../controllers/userController');
const { checkJwt } = require('../config/middleware'); // Verificación de JWT

// Middleware para validar los resultados de las validaciones
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Configuración de Multer para la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const username = req.query.username;
        if (!username) {
            return cb(new Error('Nombre de usuario no proporcionado'));
        }
        const folder = `uploads/${username}/profile-img/`;
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, 'profile.jpg'); // Siempre guarda con este nombre; podrías querer hacerlo más flexible.
    }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/updateProfileImage', checkJwt, upload.single('profileImage'), updateUserProfileImage);

router.post('/updateProfileDescription', checkJwt, [
    body('description', 'La descripción es requerida').notEmpty().trim().escape(),
    validate // Usar el middleware de validación
], updateProfileDescription);

router.get('/getUserProfile', checkJwt, getUserProfile);

module.exports = router;
