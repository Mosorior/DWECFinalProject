import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import '../assets/styles/CreatePost.css';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { postId } = useParams();
  const easyMDEEditor = useRef();
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/getpost/${postId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          if (!easyMDEEditor.current) {
            easyMDEEditor.current = new EasyMDE({
              element: document.getElementById('easy-mde-editor'),
              initialValue: data.content,
            });
          } else {
            easyMDEEditor.current.value(data.content);
          }
        } else {
          console.error('Error al cargar el post');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPostData();
  }, [postId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedContent = easyMDEEditor.current.value();

    try {
      const response = await fetch(`http://localhost:3001/api/posts/updatepost`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          postId,
          title,
          content: updatedContent,
        }),
      });

      if (response.ok) {
        navigate('/blog'); // Redirige al usuario de vuelta a la lista de posts después de editar exitosamente
      } else {
        console.error('Error al actualizar el post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h1>Editar Post</h1>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea id="easy-mde-editor"></textarea>
        <button type="submit">Actualizar Post</button>
      </form>
    </div>
  );
};

export default EditPost;
