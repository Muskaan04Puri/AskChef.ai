// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; // <-- 1. Import signOut

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- 2. Create the logout function ---
  const logout = () => {
    return signOut(auth); // This signs the user out of Firebase
  }

  const value = {
    currentUser,
    logout // <-- 3. Pass logout to the rest of your app
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};