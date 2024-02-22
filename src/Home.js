import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import logo from './assets/images/code.jpg';
import img1 from './assets/images/img1.jpg';
import img2 from './assets/images/img2.jpg';
import img3 from './assets/images/img3.jpg';
import './assets/styles/Home.css';


const Home = () => {
  const navigate = useNavigate(); // Crea una instancia de useNavigate

  const goToHome = () => {
    navigate('/'); // Función para redirigir a /home
  };

  // Configuración para el slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>
      <header>
        <div className="logo-container">
        <Slider {...settings}>
          <div>
            <img src={img1} alt="Imagen 1" />
          </div>
          <div>
            <img src={img2} alt="Imagen 2" />
          </div>
          <div>
            <img src={img3} alt="Imagen 3" />
          </div>
          </Slider>
          <h1 className="home-title" onClick={goToHome}>&lt;Code;</h1>
        </div>
      </header>
      <section>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        
      </section>
    </>
  );
};

export default Home;