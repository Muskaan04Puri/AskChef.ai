import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
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
  const { currentUser } = useAuth(); 

  useEffect(() => {
    if (currentUser) {
      navigate('/app');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="auth-divider">
        <span className="auth-divider-text">or</span>
      </div>

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