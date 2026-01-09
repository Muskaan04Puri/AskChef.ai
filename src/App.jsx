import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';    
import Main from './components/Main';     
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes: */}
        <Route path="/" element={<Register />} /> {/* Homepage is now Register */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route: */}
        <Route path="/app" element={<ProtectedRoute><Main /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App;