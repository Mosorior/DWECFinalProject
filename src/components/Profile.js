import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Profile.css';
import EditIcon from '../assets/icons/edit.svg';

const Profile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { isAuthenticated, userDetails } = useAuth();
    const navigate = useNavigate();

    // Cargar el perfil del usuario
    const loadUserProfile = async () => {
        // Obtener el token JWT del almacenamiento local
        const userToken = localStorage.getItem('jwtToken'); // Asegúrate de que 'token' coincide con la clave que usaste para almacenar el token JWT
    
        if (userDetails && userDetails.username) {
            try {
                const response = await fetch(`http://localhost:3001/api/user/getUserProfile?username=${encodeURIComponent(userDetails.username)}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`, // Incluir el token en las cabeceras de la solicitud
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDescription(data.description || 'Tu descripción aquí');
                } else {
                    console.error('Error al cargar el perfil del usuario');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }    
    };

    useEffect(() => {
        if (isAuthenticated && userDetails && userDetails.username) {
            loadUserProfile();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, userDetails, navigate]);

    // Manejadores de eventos
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const saveDescription = async () => {
        setIsEditing(false);

        // Obtener el token JWT del almacenamiento local
        const userToken = localStorage.getItem('jwtToken'); // Asegúrate de que 'token' coincide con la clave que usaste para almacenar el token JWT


        try {
            const response = await fetch('http://localhost:3001/api/user/updateProfileDescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    username: userDetails.username,
                    description,
                }),
            });
    
            if (response.ok) {
                console.log('Descripción del perfil actualizada');
            } else {
                console.log('Error al actualizar la descripción del perfil');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userDetails.username) {
            console.error('No se ha definido el nombre de usuario.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            const response = await fetch(`http://localhost:3001/updateProfileImage?username=${encodeURIComponent(userDetails.username)}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Foto de perfil actualizada');
                window.location.reload();
            } else {
                console.log('Error al actualizar la foto de perfil');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image-container" onClick={openModal}>
                    {userDetails && userDetails.username && (
                    <img src={`http://localhost:3001/uploads/${userDetails.username}/profile-img/profile.jpg`} alt="Perfil" className="profile-image-PROFILE" />
                    )}
                    <div className='image-overlay'></div>
                    <img src={EditIcon} alt="Editar" className="edit-icon" />
                </div>
                {userDetails && userDetails.username && (
                <h2 className="profile-username">{userDetails.username}</h2>
                )}
            </div>

            <div className="profile-description">
                <div className="description-label">Descripción</div>
                {isEditing ? (
                    <div className='textarea-container'>
                        <textarea className="textarea-edit" value={description} onChange={handleDescriptionChange} maxLength={500} />
                        <div className="char-count">{description.length}/500</div>   
                    </div>
                ) : (
                    <p className="description-text">{description}</p>
                )}
                <img src={EditIcon} alt="Editar" className="edit-description-icon" onClick={isEditing ? saveDescription : toggleEdit} />
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="file-drop-area">
                                Arrastra la imagen aquí o
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Profile;


