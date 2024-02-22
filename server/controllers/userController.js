const path = require('path');
const fs = require('fs');
const { db } = require('../config/db'); // Asegúrate de que la conexión a la base de datos está correctamente configurada

// Función para actualizar la imagen de perfil del usuario
const updateUserProfileImage = (req, res) => {
    const username = req.query.username;
    const profileImagePath = `uploads/${username}/profile-img/profile.jpg`; // Path donde Multer guarda la imagen

    const query = 'UPDATE users SET profileImagePath = ? WHERE username = ?';

    db.run(query, [profileImagePath, username], function(error) {
        if (error) {
            console.error('Error al actualizar la imagen de perfil:', error);
            res.status(500).send('Error en la base de datos al actualizar la imagen de perfil');
        } else {
            console.log(`Imagen de perfil actualizada para ${username}`);
            res.send('Imagen de perfil actualizada correctamente');
        }
    });
};

// Función para actualizar la descripción del perfil del usuario
const updateProfileDescription = (req, res) => {
    const { username, description } = req.body;
    const query = 'UPDATE users SET description = ? WHERE username = ?';

    db.run(query, [description, username], function(error) {
        if (error) {
            console.error('Error al actualizar la descripción del perfil:', error);
            res.status(500).send('Error en la base de datos al actualizar la descripción del perfil');
        } else {
            console.log(`Descripción del perfil actualizada para ${username}`);
            res.send('Descripción del perfil actualizada correctamente');
        }
    });
};

// Función para obtener el perfil del usuario
const getUserProfile = (req, res) => {
    const username = req.query.username;
    console.log("Username recibido", username)
    const query = 'SELECT username, description, profileImagePath FROM users WHERE username = ?';

    db.get(query, [username], (error, row) => {
        if (error) {
            console.error('Error al obtener el perfil del usuario:', error);
            res.status(500).send('Error en la base de datos al obtener el perfil del usuario');
        } else if (row) {
            res.json({ username: row.username, description: row.description || '', profileImagePath: row.profileImagePath || '' });
        } else {
            console.log('Usuario no encontrado');
            res.status(404).send('Usuario no encontrado');
        }
    });
};

module.exports = {
    updateUserProfileImage,
    updateProfileDescription,
    getUserProfile
};
