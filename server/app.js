require('dotenv').config();

const express = require('express');
const { configureMiddleware } = require('./config/middleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');



// Crear la aplicación Express
const app = express();

// Configuración del puerto
const PORT = 3001;

// Configurar middleware global
configureMiddleware(app);

// Definir rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', blogRoutes);

// Ruta de prueba o home
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('Lo sentimos, no se pudo encontrar la ruta solicitada.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
