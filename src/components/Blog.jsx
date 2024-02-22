import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/Blog.css';
import SearchIcon from '../assets/icons/search.svg'; // Asegúrate de tener este icono

const Blog = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const userRole = userDetails.role;
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts/public/blogposts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts); 
        } else {
          console.error('Error al cargar los posts del blog');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    loadPosts();
  }, []);

  const goToHome = () => navigate('/');

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='blog-container'>
      <div className='blog-title-container'>
        <h1 className='blog-title' onClick={goToHome}>&lt;Code;</h1>
      </div>
      <div className='blog-navigation'>
        <div className='blog-nav-links'>
          <Link to="/">Opción 1</Link>
          <Link to="/">Opción 2</Link>
          <Link to="/">Opción 3</Link>
          <Link to="/">Opción 4</Link>
        </div>
        <div className={`blog-nav-icons ${showSearch ? 'show-search' : ''}`}>
          <div className="search-icon-container" onClick={handleSearchIconClick}>
            <img src={SearchIcon} alt="Buscar" className='search-icon' />
          </div>
          <input className='blog-input-text' type="text" placeholder="Buscar en posts" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {isAuthenticated && (userRole === 'admin' || userRole === 'blog') && (
            <Link to="/userposts" className='create-post-button'>Posts</Link>
          )}
        </div>
      </div>
      <div className='blog-posts'>
        {filteredPosts.length > 0 ? filteredPosts.slice(0, 3).map((post, index) => (
          <div key={index} className='blog-post'>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        )) : <p>No se encontraron posts que coincidan con la búsqueda.</p>}
      </div>
    </div>
  );  
}; 

export default Blog;
