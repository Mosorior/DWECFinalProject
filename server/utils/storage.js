const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para crear un directorio si no existe
const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const username = req.query.username; // Asumiendo que el nombre de usuario viene como parámetro de consulta
        if (!username) {
            cb(new Error('Nombre de usuario no proporcionado'), null);
            return;
        }
        const uploadsDir = path.join(__dirname, '../uploads', username, 'profile-img');
        createFolder(uploadsDir); // Asegura que el directorio exista
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo, podrías añadir lógica para personalizarlo
        cb(null, 'profile.jpg');
    }
});

// Middleware de Multer para procesar archivos de formulario
const upload = multer({ storage: storage });

module.exports = {
    upload
};
