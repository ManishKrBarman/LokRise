import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create twinkling stars
    const starsContainer = document.getElementById('stars');
    const starCount = 150; // Increased star count
    
    if (starsContainer) {
      starsContainer.innerHTML = '';
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random size between 1-4px (slightly larger)
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        // Random animation duration
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;

        // Add occasional shooting star
        if (i % 30 === 0) {
          star.classList.add('shooting-star');
          star.style.animationDuration = `${Math.random() * 3 + 5}s`;
        }

        starsContainer.appendChild(star);
      }
    }

    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className={`not-found-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="space-background"></div>
      
      <div className="container">
        <h1 className="error-code">404</h1>
        <div className="astronaut">
          <div className="astronaut-head">
            <div className="astronaut-visor">
              <div className="visor-reflection"></div>
            </div>
          </div>
          <div className="astronaut-body">
            <div className="backpack"></div>
          </div>
          <div className="astronaut-arm-left">
            <div className="hand"></div>
          </div>
          <div className="astronaut-arm-right">
            <div className="hand"></div>
          </div>
          <div className="astronaut-leg-left"></div>
          <div className="astronaut-leg-right"></div>
          <div className="astronaut-jetpack">
            <div className="jetpack-flame"></div>
          </div>
        </div>
        <h2 className="error-message">Houston, we have a problem!</h2>
        <p className="error-description">
          The page you're looking for has floated off into space.<br />
          Don't worry, our astronaut is on a rescue mission.
        </p>
        <Link to="/" className="home-button">
          <span className="button-text">Return to Earth</span>
          <span className="button-icon">🚀</span>
        </Link>
      </div>

      <div className="planet">
        <div className="crater crater-1"></div>
        <div className="crater crater-2"></div>
        <div className="crater crater-3"></div>
        <div className="crater crater-4"></div>
        <div className="crater crater-5"></div>
      </div>
      
      <div className="moon">
        <div className="moon-crater moon-crater-1"></div>
        <div className="moon-crater moon-crater-2"></div>
      </div>
      
      <div className="satellite"></div>
      <div className="stars" id="stars"></div>

      <style jsx>{`
        .not-found-page {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #0f1b41 0%, #152a5c 50%, #171f47 100%);
          color: #fff;
          text-align: center;
          padding: 0;
          margin: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        
        .space-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(13, 26, 53, 0.8) 0%, rgba(10, 13, 23, 1) 100%);
          z-index: -3;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          z-index: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1.2s cubic-bezier(0.17, 0.84, 0.44, 1);
        }
        
        .loaded .container {
          opacity: 1;
          transform: translateY(0);
        }

        .error-code {
          font-size: 10rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
          position: relative;
          animation: bounce 2s infinite, glow 3s infinite alternate;
        }

        h2 {
          font-size: 2.2rem;
          margin-top: 0;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
        }

        p {
          font-size: 1.3rem;
          line-height: 1.7;
          margin: 30px 0;
          color: #d1e3ff;
          opacity: 0.9;
        }

        .home-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          color: white;
          padding: 14px 36px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.4s ease;
          font-size: 1.1rem;
          box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
          position: relative;
          overflow: hidden;
        }

        .home-button:hover {
          transform: scale(1.05) translateY(-3px);
          box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);
        }
        
        .home-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .home-button:hover:before {
          left: 100%;
        }
        
        .button-text {
          margin-right: 10px;
        }
        
        .button-icon {
          font-size: 1.2rem;
          transform: rotate(45deg);
          display: inline-block;
          transition: transform 0.3s ease;
        }
        
        .home-button:hover .button-icon {
          transform: rotate(45deg) translateX(3px);
        }

        .astronaut {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 30px auto;
          animation: float 6s infinite ease-in-out;
          transform-origin: center bottom;
        }

        .astronaut-body {
          width: 60px;
          height: 90px;
          background-color: #f5f5f5;
          border-radius: 35px;
          position: relative;
          left: 45px;
          top: 30px;
          box-shadow: inset -8px 0 rgba(0, 0, 0, 0.1);
        }
        
        .backpack {
          position: absolute;
          width: 40px;
          height: 60px;
          background: #e0e0e0;
          border-radius: 10px;
          top: 15px;
          left: -25px;
          box-shadow: inset -4px 0 rgba(0, 0, 0, 0.1);
        }

        .astronaut-head {
          width: 70px;
          height: 70px;
          background-color: white;
          border: 5px solid #f0f0f0;
          border-radius: 50%;
          position: absolute;
          top: -30px;
          left: 35px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          overflow: hidden;
        }

        .astronaut-visor {
          width: 40px;
          height: 25px;
          background-color: #2c3e50;
          border-radius: 10px;
          position: absolute;
          top: 20px;
          left: 15px;
          overflow: hidden;
        }
        
        .visor-reflection {
          position: absolute;
          width: 15px;
          height: 5px;
          background: rgba(255, 255, 255, 0.6);
          transform: rotate(-30deg);
          top: 5px;
          left: 5px;
          border-radius: 5px;
        }

        .astronaut-arm-left,
        .astronaut-arm-right {
          width: 20px;
          height: 60px;
          background-color: #f5f5f5;
          border-radius: 10px;
          position: absolute;
        }

        .astronaut-arm-left {
          transform: rotate(20deg);
          left: 25px;
          top: 40px;
          animation: wave 3s infinite ease-in-out;
        }

        .astronaut-arm-right {
          transform: rotate(-20deg);
          right: 25px;
          top: 40px;
        }
        
        .hand {
          position: absolute;
          width: 22px;
          height: 22px;
          background: #f5f5f5;
          border-radius: 50%;
          bottom: -10px;
          left: -1px;
        }

        .astronaut-leg-left,
        .astronaut-leg-right {
          width: 25px;
          height: 40px;
          background-color: #f5f5f5;
          border-radius: 10px;
          position: absolute;
          bottom: -20px;
        }

        .astronaut-leg-left {
          left: 45px;
          transform: rotate(5deg);
        }

        .astronaut-leg-right {
          right: 40px;
          transform: rotate(-5deg);
        }
        
        .astronaut-jetpack {
          position: absolute;
          width: 40px;
          height: 50px;
          background: #cccccc;
          border-radius: 10px;
          top: 50px;
          left: -15px;
          z-index: -1;
        }
        
        .jetpack-flame {
          position: absolute;
          width: 20px;
          height: 30px;
          background: linear-gradient(to bottom, #ff9d00, transparent);
          border-radius: 50%;
          bottom: -20px;
          left: 10px;
          opacity: 0.7;
          animation: flame 0.5s infinite alternate;
        }

        .planet {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #89cff0, #c8e6ff);
          border-radius: 50%;
          position: absolute;
          bottom: -250px;
          left: 50%;
          transform: translateX(-50%);
          z-index: -1;
          box-shadow: 
            inset -40px -40px 100px rgba(0, 0, 0, 0.2),
            0 0 50px rgba(200, 230, 255, 0.5);
          opacity: 0;
          transition: all 1.5s ease-out;
        }
        
        .loaded .planet {
          opacity: 1;
          bottom: -230px;
        }
        
        .crater {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          box-shadow: inset 3px 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .crater-1 {
          width: 60px;
          height: 60px;
          top: 50px;
          left: 100px;
        }
        
        .crater-2 {
          width: 40px;
          height: 40px;
          top: 150px;
          left: 60px;
        }
        
        .crater-3 {
          width: 80px;
          height: 80px;
          top: 30px;
          right: 80px;
        }
        
        .crater-4 {
          width: 30px;
          height: 30px;
          top: 200px;
          right: 50px;
        }
        
        .crater-5 {
          width: 50px;
          height: 50px;
          top: 120px;
          left: 180px;
        }
        
        .moon {
          width: 100px;
          height: 100px;
          background: #f0f0f0;
          border-radius: 50%;
          position: absolute;
          top: 100px;
          right: 100px;
          box-shadow: 
            inset -10px -10px 20px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(255, 255, 255, 0.4);
          opacity: 0;
          transform: translateY(20px);
          transition: all 1.8s ease-out;
        }
        
        .loaded .moon {
          opacity: 0.6;
          transform: translateY(0);
        }
        
        .moon-crater {
          position: absolute;
          background: rgba(200, 200, 200, 0.3);
          border-radius: 50%;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .moon-crater-1 {
          width: 30px;
          height: 30px;
          top: 20px;
          left: 20px;
        }
        
        .moon-crater-2 {
          width: 20px;
          height: 20px;
          bottom: 15px;
          right: 25px;
        }
        
        .satellite {
          width: 40px;
          height: 20px;
          background: #bbbbbb;
          position: absolute;
          top: 180px;
          left: 150px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transform: rotate(25deg);
          opacity: 0;
          transition: all 2s ease-out;
          animation: satellite 15s linear infinite;
        }
        
        .loaded .satellite {
          opacity: 0.7;
        }
        
        .satellite:before, .satellite:after {
          content: '';
          position: absolute;
          width: 60px;
          height: 10px;
          background: linear-gradient(90deg, #aaaaaa, #dddddd);
          top: 5px;
          left: -70px;
          border-radius: 5px;
        }
        
        .satellite:after {
          left: 50px;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
        }

        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 3s infinite alternate;
        }
        
        .shooting-star {
          width: 4px !important;
          height: 4px !important;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), #ffffff 50%, rgba(255, 255, 255, 0));
          border-radius: 0;
          transform: rotate(45deg);
          animation: shoot 6s linear infinite !important;
        }

        @keyframes twinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shoot {
          0% {
            transform: translateX(-100px) translateY(-100px) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          20% {
            transform: translateX(calc(100vw + 200px)) translateY(calc(100vh + 200px)) rotate(45deg);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes glow {
          0% {
            text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
          }
          100% {
            text-shadow: 0 0 30px rgba(255, 107, 107, 0.8), 0 0 50px rgba(255, 107, 107, 0.4);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: rotate(20deg);
          }
          50% {
            transform: rotate(30deg);
          }
        }
        
        @keyframes flame {
          0% {
            height: 20px;
            opacity: 0.5;
          }
          100% {
            height: 30px;
            opacity: 0.8;
          }
        }
        
        @keyframes satellite {
          0% {
            transform: rotate(25deg) translateX(-100px) translateY(50px);
          }
          50% {
            transform: rotate(25deg) translateX(calc(100vw + 200px)) translateY(-100px);
          }
          50.1% {
            transform: rotate(25deg) translateX(-100px) translateY(-100px);
          }
          100% {
            transform: rotate(25deg) translateX(calc(100vw + 200px)) translateY(50px);
          }
        }

        @media (max-width: 768px) {
          .error-code {
            font-size: 6rem;
          }
          h2 {
            font-size: 1.6rem;
          }
          p {
            font-size: 1.1rem;
          }
          .planet {
            width: 250px;
            height: 250px;
          }
          .moon {
            width: 70px;
            height: 70px;
            top: 70px;
            right: 70px;
          }
          .moon-crater-1 {
            width: 20px;
            height: 20px;
          }
          .moon-crater-2 {
            width: 15px;
            height: 15px;
          }
          .satellite {
            width: 30px;
            height: 15px;
          }
          .satellite:before, .satellite:after {
            width: 40px;
            height: 8px;
            left: -50px;
          }
          .satellite:after {
            left: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;