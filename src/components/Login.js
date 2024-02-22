// src/Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/Login.css';
import userIcon from '../assets/icons/user.svg'; // Asegúrate de tener este icono
import passwordIcon from '../assets/icons/password.svg'; // Asegúrate de tener este icono


const Login = () => { 
    const { setIsAuthenticated, setUserDetails } = useAuth(); // Obtener setUserDetails de AuthContext
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwtToken', data.token); // Almacenar solo el token JWT
                setIsAuthenticated(true);
                setUserDetails({ username, role: data.role }); // Establecer los detalles del usuario
                navigate('/');
            } else {
                const message = await response.text();
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-form-group">
                        <img src={userIcon} alt="User" />
                        <input
                            id="username"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <img src={passwordIcon} alt="Password" />
                        <input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <Link to="/register" className="register-link">¿No tienes cuenta? Regístrate</Link>
            </div>
        </div>
    );
};

export default Login;
