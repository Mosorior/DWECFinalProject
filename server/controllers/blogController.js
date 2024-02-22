// controllers/blogController.js
const { db } = require('../config/db');

exports.createPost = (req, res) => {
    const { title, content, author } = req.body;
    const insertQuery = 'INSERT INTO blogposts (title, content, author, date, isPublished) VALUES (?, ?, ?, datetime("now"), 0)';
    db.run(insertQuery, [title, content, author], function(error) {
        if (error) {
            console.error('Error al crear el post:', error);
            return res.status(500).send('Error al crear el post');
        }
        res.status(201).send({ message: 'Post creado exitosamente', postId: this.lastID });
    });
};

exports.updatePost = (req, res) => {
    const { postId, title, content } = req.body;

    if (!postId || !title || !content) {
        return res.status(400).send('Los campos postId, title y content son requeridos');
    }

    const updateQuery = 'UPDATE blogposts SET title = ?, content = ? WHERE id = ?';

    db.run(updateQuery, [title, content, postId], function(error) {
        if (error) {
            console.error('Error al actualizar el post:', error);
            return res.status(500).send('Error al actualizar el post');
        }
        if (this.changes > 0) {
            res.send({ message: 'Post actualizado correctamente', postId: postId });
        } else {
            res.status(404).send({ message: 'Post no encontrado' });
        }
    });
};

exports.deletePost = (req, res) => {
    const { postId } = req.params;
    const deleteQuery = 'DELETE FROM blogposts WHERE id = ?';
    db.run(deleteQuery, postId, function(error) {
        if (error) {
            console.error('Error al eliminar el post:', error);
            return res.status(500).send('Error al eliminar el post');
        }
        res.send('Post eliminado exitosamente');
    });
};

exports.savePost = (req, res) => {
    const { title, content, author, postId } = req.body;

    // Si `postId` es proporcionado, actualiza el post existente. De lo contrario, crea uno nuevo.
    if (postId) {
        const updateQuery = 'UPDATE blogposts SET title = ?, content = ?, date = datetime("now") WHERE id = ?';
        db.run(updateQuery, [title, content, postId], function(error) {
            if (error) {
                console.error('Error al actualizar el post:', error);
                return res.status(500).send('Error al guardar los cambios del post');
            }
            res.send({ message: 'Cambios en el post guardados exitosamente', postId });
        });
    } else {
        const insertQuery = 'INSERT INTO blogposts (title, content, author, date, isPublished) VALUES (?, ?, ?, datetime("now"), 0)';
        db.run(insertQuery, [title, content, author], function(error) {
            if (error) {
                console.error('Error al crear el post:', error);
                return res.status(500).send('Error al crear el post');
            }
            res.status(201).send({ message: 'Post guardado exitosamente', postId: this.lastID });
        });
    }
};


exports.publishPost = (req, res) => {
    const { postId } = req.body;
    const publishQuery = 'UPDATE blogposts SET isPublished = 1 WHERE id = ?';
    db.run(publishQuery, postId, function(error) {
        if (error) {
            console.error('Error al publicar el post:', error);
            return res.status(500).json({ message: 'Error al publicar el post' });
        }
        res.json({ message: 'Post publicado exitosamente' });
    });
};

exports.getPost = (req, res) => {
    const postId = req.params.postId;
    const query = "SELECT * FROM blogposts WHERE id = ?";

    db.get(query, [postId], (err, row) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error en la base de datos');
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send('Post no encontrado');
        }
    });
};


exports.getAllPublishedPosts = (req, res) => {
    const query = "SELECT * FROM blogposts WHERE isPublished = 1 ORDER BY date DESC";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error en la base de datos');
        }
        res.json({ posts: rows });
    });
};
