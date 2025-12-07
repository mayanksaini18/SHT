import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';


export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // change '/signup' to whatever your create-account route is
    navigate('/register');
  };

  const handleAlreadyAccount = () => {
    // change '/login' to your login route
    navigate('/login');
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <p className="welcome-tagline">Build healthy habits with us</p>

        {/* Mascot / illustration */}
        {/* Replace src with your own image file */}
        <div className="welcome-illustration">
          {/* If you have an image: */}
          {/* <img src="/images/mascot.png" alt="Healthy habit mascot" /> */}
          {/* Temporary emoji mascot */}
          <span role="img" aria-label="mascot"></span>
        </div>

        <button className="welcome-primary-btn" onClick={handleGetStarted}>
          Get started
        </button>

        <button
          className="welcome-secondary-link"
          type="button"
          onClick={handleAlreadyAccount}
        >
          I have an account
        </button>

        <p className="welcome-terms">
          By starting or signing in, you agree<br />
          to our <span className="welcome-terms-link">Terms of use</span>
        </p>
      </div>
    </div>
  );
}
