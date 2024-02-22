// src/App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './components/Navbar';
import About from './About';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Blog from './components/Blog';
import CreatePost from './components/CreatePost';
import UserPosts from './components/UserPosts';
import EditPost from './components/EditPost';
import './assets/fonts/fonts.css';
import NotFoundPage from './NotFoundPage';

const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/blog' element={<Blog/>} />
            <Route path='/createpost' element={<CreatePost/>} />
            <Route path='/userposts' element={<UserPosts/>} />
            <Route path='/editpost/:postId' element={<EditPost/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
