import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/UserPosts.css';
import CrossIcon from '../assets/icons/cross.svg';
import CheckIcon from '../assets/icons/check.svg';
import { useAuth } from '../context/AuthContext'; // Importa useAuth

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useAuth(); // Utiliza useAuth para acceder a los detalles del usuario
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  const navigate = useNavigate();

  const getJWTToken = () => localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!userDetails || (userDetails.role !== 'admin' && userDetails.role !== 'blog')) {
      navigate('/blog'); // Redirige a /blog si el usuario no es admin ni blog
      return; // Salir del useEffect para evitar cargar posts
    }
    const loadPosts = async () => {
      setLoading(true);
      const jwtToken = localStorage.getItem('jwtToken'); // Accede al JWT almacenado
      try {
        // La URL se mantiene igual; el backend determinará qué posts devolver basado en el rol del usuario
        const response = await fetch(`http://localhost:3001/api/posts/userposts`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts); // Establece los posts en el estado
        } else {
          console.error('Error al cargar los posts');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePublish = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/publishpost`, { // Asegúrate de que la ruta coincide con la definida en el backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJWTToken()}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        console.log('Post publicado exitosamente');
        // Considera recargar los posts para reflejar el cambio de estado
        setPosts(posts.map(post => post.id === postId ? { ...post, isPublished: true } : post));
      } else {
        console.error('Error al publicar el post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClick = (postId) => {
    setShowDeleteModal(true);
    setCurrentPostId(postId);
  };

  const confirmDelete = async () => {
    if (!currentPostId) return;

    try {
        const response = await fetch(`http://localhost:3001/api/posts/deletepost/${currentPostId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getJWTToken()}`,
            },
        });

        if (response.ok) {
            console.log('Post eliminado exitosamente');
            setPosts(posts.filter(post => post.id !== currentPostId));
        } else {
            console.error('Error al eliminar el post');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setShowDeleteModal(false);
        setCurrentPostId(null);
    }
  };

  return (
    <div className="user-posts-container">
      <h1 className="user-posts-title">Mis Posts</h1>
      <Link to="/createpost" className="add-post-button">Añadir Post</Link>
      {loading ? <p>Cargando...</p> : (
        posts.map((post, index) => (
          <div key={index} className="user-post">
            <h2>{post.title}</h2>
            {/* Solo muestra las opciones de edición y publicación a los administradores y al autor del post */}
            {(userDetails.role === 'admin' || post.author === userDetails.username) && (
              <div className="user-post-buttons">
                <Link to={`/editpost/${post.id}`}>Editar</Link>
                {!post.isPublished && <button onClick={() => handlePublish(post.id)}>Publicar</button>}
                <button onClick={() => handleDeleteClick(post.id)}>Eliminar</button>
              </div>
            )}
          </div>
        ))
      )}
      {showDeleteModal && (
        <div className="delete-confirmation">
          <p className="delete-message">¿Estás seguro de que deseas eliminar este post?</p>
          <div className="delete-buttons">
            <img src={CrossIcon} alt="Cancelar" className="cancel-button" onClick={() => setShowDeleteModal(false)} />
            <img src={CheckIcon} alt="Confirmar" className="delete-button" onClick={confirmDelete} />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UserPosts;