import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import '../assets/fonts/fonts.css';
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg';

const Navbar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const { isAuthenticated, userDetails, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const goToHome = () => navigate('/');

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const handleMenuOptionClick = () => setMenuVisible(false);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        handleMenuOptionClick();
        navigate('/');
    };

    return (
        <nav>
            <div className='navbar-content'>
                <div className="navbar-title" onClick={goToHome}>&lt;Code;</div>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/about">Sobre mí</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>
                <div className="login-section">
                    {isAuthenticated && userDetails ? (
                        <div>
                            <img src={`http://localhost:3001/uploads/${userDetails.username}/profile-img/profile.jpg`} alt="Perfil" className="profile-image" onClick={toggleMenu} />
                            <div className={`profile-menu ${menuVisible ? 'active' : ''}`}>
                                <Link to="/profile" className="profile-menu-item" onClick={handleMenuOptionClick}>Perfil</Link>
                                <div className="profile-menu-item" onClick={handleMenuOptionClick}>Opción 2</div>
                                <div className="profile-menu-item" onClick={handleMenuOptionClick}>Opción 3</div>
                                <div className="profile-menu-item" onClick={handleLogout}>
                                    <LogoutIcon /> Cerrar Sesión
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="navbar-login-button">Iniciar Sesión</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
