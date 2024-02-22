import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import '../assets/styles/CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [postId, setPostId] = useState(null);
  const easyMDEEditor = useRef();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    if (!userDetails || (userDetails.role !== 'admin' && userDetails.role !== 'blog')) {
      navigate('/');
    }

    if (!easyMDEEditor.current) {
      easyMDEEditor.current = new EasyMDE({
        element: document.getElementById('easy-mde-editor'),
        toolbar: [
          'bold', 'italic', 'heading', '|',
          'quote', 'unordered-list', 'ordered-list', '|',
          'link', 'image', '|', 'guide'
        ],
        previewRender: function(plainText) {
          return this.parent.markdown(plainText);
        }
      });
    }
  }, [navigate, userDetails]);

  const handleAction = async (url) => {
    const content = easyMDEEditor.current.value();
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          author: userDetails.username,
          postId,
        }),
      });

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('Acción realizada exitosamente', data);
          if (url === 'savepost') {
            setPostId(data.postId); // Actualizar postId con el ID del post guardado
            setSuccessMessage('El post se ha guardado exitosamente.'); // Establecer el mensaje de éxito
            setTimeout(() => setSuccessMessage(''), 3000); // Opcional: limpiar el mensaje después de 3 segundos        
          } else {
            navigate('/blog');
          }
        } catch (error) {
          console.error('La respuesta no es JSON válido:', error);
        }
      } else {
        const errorText = await response.text(); // Intenta leer el cuerpo como texto si no es JSON
        console.error('Error al procesar el post:', errorText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handlePublish = () => handleAction('publishpost');
  const handleSave = () => handleAction('savepost');

  return (
    <div className="create-post-container">
      <form className="create-post-form">
        <h1>Crear Nuevo Post</h1>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea id="easy-mde-editor"></textarea>
        <div className="post-buttons">
          <button type="button" onClick={handlePublish}>Publicar</button>
          <button type="button" onClick={handleSave}>Guardar</button>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
