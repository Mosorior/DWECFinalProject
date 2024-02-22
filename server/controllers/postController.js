const { db } = require('../config/db');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const getUserPosts = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { username, role } = decoded;

    let query = '';
    let params = [];

    if (role === 'admin') {
      query = 'SELECT * FROM blogposts ORDER BY date DESC';
    } else {
      query = 'SELECT * FROM blogposts WHERE author = ? ORDER BY date DESC';
      params.push(username);
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        return res.status(500).send('Error en la base de datos');
      }
      res.json({ posts: rows });
    });
  } catch (error) {
    console.error('Error al verificar token', error);
    return res.status(401).send('Token inválido o expirado');
  }
};

module.exports = { getUserPosts };
