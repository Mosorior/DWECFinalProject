import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode} from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token: ', error);
            return true;
        }
    };

    const fetchUserDetails = async (token, username) => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/getUserProfile?username=${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);
                setIsAuthenticated(true);
            } else {
                throw new Error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details: ', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken && !isTokenExpired(jwtToken)) {
            const decodedToken = jwtDecode(jwtToken);
            const username = decodedToken.username; // Asegúrate de que el token incluya el campo 'username'
            if(username) {
                fetchUserDetails(jwtToken, username);
            } else {
                console.error('JWT token does not contain username');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userDetails, setUserDetails, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
