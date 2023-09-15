import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import SignIn from '../signIn/SignIn'; // Import the SignIn component
import SignUp from '../signUp/SignUp'; // Import the SignUp component
import './SignPage.css'; // Import a CSS file for styling

function SignPage({ onSignIn, onSignUp, user }) {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleToggleForm = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // Initial animation properties (opacity and y position)
      animate={{ opacity: 1, y: 0 }} // Animation properties when component enters
      exit={{ opacity: 0, y: 20 }} // Animation properties when component exits
      transition={{ duration: 0.5 }} // Duration of the animation
      className="sign-page-container" // Apply CSS class for styling
    >
      <div>
        <h1>Welcome to Sign Page</h1>
        <div className="form-container">
          {showSignIn ? (
            // Render the SignIn component
            <SignIn onSignIn={onSignIn} />
          ) : (
            // Render the SignUp component
            <SignUp onSignUp={onSignUp} />
          )}
        </div>
        <button onClick={handleToggleForm} className="toggle-button">
          {showSignIn ? 'Switch to Sign Up' : 'Switch to Sign In'}
        </button>

        {showSignIn && (
          <button className="recover-button">Recover Account</button>
        )}
      </div>
    </motion.div>
  );
}

export default SignPage;