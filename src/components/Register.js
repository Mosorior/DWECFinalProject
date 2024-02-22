// src/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Register.css';
import userIcon from '../assets/icons/user.svg';
import emailIcon from '../assets/icons/email.svg';
import passwordIcon from '../assets/icons/password.svg';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        if (!/(?=.*[a-z])/.test(password)) {
            return 'La contraseña requiere al menos 1 minúscula.';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'La contraseña requiere al menos 1 mayúscula.';
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            return 'La contraseña requiere al menos 1 carácter especial (@$!%*?&).';
        }
        if (!/.{8,}/.test(password)) {
            return 'La contraseña debe contener al menos 8 caracteres.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (username.length < 5) {
            setErrorMessage('El nombre de usuario debe tener al menos 5 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Por favor, introduce un correo electrónico válido.');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.status === 409) {
                setErrorMessage('El usuario o el e-mail ya están registrados');
            } else if (!response.ok) {
                setErrorMessage('Error al registrar el usuario');
            } else {
                setIsRegistered(true);
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    };

    if (isRegistered) {
        return (
            <div>
                <p>Registro exitoso. Ya puedes iniciar sesión.</p>
                <Link to="/login">
                    <button>Iniciar Sesión</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-form-group">
                        <img src={userIcon} alt="User" />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" required />
                    </div>
                    <div className="register-form-group">
                        <img src={passwordIcon} alt="Password" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                    </div>
                    <div className="register-form-group">
                        <img src={emailIcon} alt="Email" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
                    </div>
                    <button type="submit" className="register-button">Registrar</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <Link to="/login" className="register-link">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
        </div>
    );
};

export default Register;
