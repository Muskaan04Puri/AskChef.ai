// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- 1. Email/Password Login ---
  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app'); // Success! Go to the main app page.
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- 2. Google Sign-in ---
  // In src/pages/Login.jsx

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/app'); // Success! Go to the main app page.
    } catch (err) {
      // --- THIS IS THE CHANGE ---
      // Only show an error if it's NOT the "popup closed" error
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
      // --- END OF CHANGE ---
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      
      {/* --- 3. The Form --- */}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        {error && <p className="auth-error">{error}</p>}
        
        {/* --- 4. Make sure to use 'submit-btn' class --- */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="auth-divider">
        <span className="auth-divider-text">or</span>
      </div>

      {/* --- 5. Google Button --- */}
      <button onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
        Sign in with Google
      </button>

      <p>
        Don't have an account? <Link to="/">Register here</Link>
      </p>
    </div>
  );
};

export default Login;