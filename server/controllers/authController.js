const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { jwtSecret } = require('../config/config');
const fs = require('fs');
const path = require('path');

// Función para registrar un nuevo usuario
const register = (req, res) => {
    const { username, email, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    db.get(query, [username, email], (err, row) => {
        if (err) {
            return res.status(500).send('Error en la base de datos');
        } 
        if (row) {
            return res.status(409).send('El nombre de usuario o el correo electrónico ya están en uso');
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).send('Error al encriptar la contraseña');
            }

            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.run(insertQuery, [username, email, hash], function(error) {
                if (error) {
                    return res.status(500).send('Error al registrar el usuario');
                }
                // Lógica para copiar la imagen predeterminada
                const sourcePath = path.join(__dirname, '../default/Byte-logo.jpg');
                const destDir = path.join(__dirname, `../uploads/${username}/profile-img`);
                fs.mkdirSync(destDir, { recursive: true }); // Crea el directorio si no existe
                const destPath = path.join(destDir, 'profile.jpg');
                fs.copyFileSync(sourcePath, destPath);

                res.status(200).send('Usuario registrado correctamente');
            });
        });
    });
};

// Función para iniciar sesión modificada para incluir el username en el token
const login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).send('Error en la base de datos');
        } 
        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error al comparar la contraseña:', err);
                return res.status(500).send('Error al procesar la solicitud');
            }
            if (result) {
                // Se incluye el username en el payload del token
                const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1d' });
                res.json({ token, role: user.role });
            } else {
                res.status(401).send('Contraseña incorrecta');
            }
        });
    });
};

module.exports = {
    register,
    login
};
