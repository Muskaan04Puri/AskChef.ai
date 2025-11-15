// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // <-- 1. Import your auth hook

const Header = () => {
  const { currentUser, logout } = useAuth(); // <-- 2. Get the user and logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // After logout, send to login page
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  // --- 3. Get the user's name ---
  // Google sign-in gives a 'displayName', but email/password doesn't.
  // So, we'll use the email as a fallback.
  const username = currentUser?.displayName || currentUser?.email;

  return (
    <header>
      {/* Logo group links to the main app if logged in, or homepage if not */}
      <Link to={currentUser ? "/app" : "/"} className="logo-link"> 
        <img src="https://imgs.search.brave.com/ZHirv-k1a67VNrwBK2U6botzBW1WtwFtzrJI0Mhd0kQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9teWNo/ZWZhaS5jb20vX25l/eHQvaW1hZ2U_dXJs/PS92ZWdhaS53ZWJw/Jnc9Mzg0MCZxPTc1" alt="chef- icon" />
        <h1>AskChef.ai</h1>
      </Link>
      
      {/* --- 4. This is the new conditional logic --- */}
      <nav className="auth-nav">
        {currentUser ? (
          // If user IS logged in:
          <>
            <span className="user-info">Hello, {username}</span>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          // If user is NOT logged in:
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header;