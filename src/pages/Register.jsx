import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';

const Register = () => {
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

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      
      <div className="auth-divider">
        <span className="auth-divider-text">or</span>
      </div>

      <button onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
        Sign up with Google
      </button>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;