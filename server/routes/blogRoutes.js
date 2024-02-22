const express = require('express');
const router = express.Router();
const { createPost, updatePost, deletePost, savePost, publishPost, getPost, getAllPublishedPosts } = require('../controllers/blogController');
const { getUserPosts } = require('../controllers/postController');
const { checkJwt } = require('../config/middleware');

// Ruta pública accesible sin JWT
router.get('/public/blogposts', getAllPublishedPosts);

// Proteger todas las siguientes rutas de blog con JWT
router.use(checkJwt);

router.post('/create', createPost);
router.put('/updatepost', updatePost);
router.delete('/deletepost/:postId', deletePost);
router.post('/savepost', savePost);
router.post('/publishpost', publishPost);
router.get('/getpost/:postId', getPost);
router.get('/userposts', getUserPosts);

module.exports = router;
