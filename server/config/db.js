const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
let db = new sqlite3.Database('./db.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        initializeDatabase();
    }
});

// Inicializar la base de datos con tablas necesarias
function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT,
            password TEXT,
            description TEXT,
            role TEXT DEFAULT 'basic'
        )`, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'users'", err.message);
            } else {
                console.log("Tabla 'users' creada o ya existente.");
                db.run(`ALTER TABLE users ADD COLUMN profileImagePath TEXT`, (alterErr) => {
                    if (alterErr) {
                        // Es normal recibir un error si la columna ya existe, así que puedes ignorarlo o manejarlo según sea necesario.
                        console.log("La columna 'profileImagePath' ya existe o no pudo ser creada.");
                    } else {
                        console.log("Columna 'profileImagePath' añadida correctamente a la tabla 'users'.");
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS blogposts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            author TEXT,
            date TEXT,
            isPublished BOOLEAN DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'blogposts'", err.message);
            } else {
                console.log("Tabla 'blogposts' creada o ya existente.");
            }
        });

        // Más inicializaciones de tablas aquí
    });
}

// Exportar la conexión para usarla en otros archivos
module.exports = { db };
