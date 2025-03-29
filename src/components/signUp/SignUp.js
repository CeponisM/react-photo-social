import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Import auth and db

function SignUp(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const provider = new GoogleAuthProvider();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getErrorMessage = (error) => {
    const errorMessages = {
      'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
      'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.'
    };
    
    return errorMessages[error.code] || 'An error occurred during sign up. Please try again.';
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', color: '#dc3545', text: 'Weak' };
    if (strength <= 3) return { level: 'medium', color: '#ffc107', text: 'Medium' };
    return { level: 'strong', color: '#28a745', text: 'Strong' };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      props.onSignUp(user);
      
      // Clear form on success
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error signing up', error);
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      props.onSignUp(user);
    } catch (error) {
      console.error('Error signing up with Google', error);
      
      let errorMessage = 'Failed to sign up with Google. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email. Please sign in instead.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      {errors.general && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="input-group">
          <div className="password-container">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password" 
              value={password} 
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {password && passwordStrength && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${(passwordStrength.level === 'weak' ? 33 : passwordStrength.level === 'medium' ? 66 : 100)}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: passwordStrength.color }}>
                {passwordStrength.text}
              </span>
            </div>
          )}
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="input-group">
          <div className="password-container">
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {confirmPassword && password && confirmPassword === password && (
            <span className="success-message">✓ Passwords match</span>
          )}
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          
          <button 
            type="button"
            onClick={handleGoogleSignUp}
            className={`btn btn-google ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Please wait...
              </>
            ) : (
              <>
                <span className="google-icon">G</span>
                Sign Up with Google
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .signup-container {
          width: 100%;
        }

        .error-alert {
          background: #f8d7da;
          border: 1px solid #f1aeb5;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #721c24;
        }

        .error-icon {
          flex-shrink: 0;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .password-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #fff;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input.input-error {
          border-color: #dc3545;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

        .form-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 6px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .password-toggle:hover:not(:disabled) {
          background-color: #f8f9fa;
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e1e5e9;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-text {
          font-size: 12px;
          font-weight: 600;
          min-width: 60px;
        }

        .field-error {
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }

        .success-message {
          color: #28a745;
          font-size: 14px;
          margin-top: 4px;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
        }

        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .btn-google {
          background: #fff;
          color: #333;
          border: 2px solid #e1e5e9;
        }

        .btn-google:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #007bff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .google-icon {
          background: linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: bold;
          font-size: 18px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .form-input {
            padding: 10px 14px;
            font-size: 16px; /* Prevent zoom on iOS */
          }
          
          .btn {
            padding: 10px 16px;
            font-size: 15px;
          }
          
          .password-strength {
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
          }
          
          .strength-text {
            text-align: center;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default SignUp;
