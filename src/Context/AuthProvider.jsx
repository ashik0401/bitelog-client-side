import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getIdToken
} from 'firebase/auth';
import { auth } from '../firebase/firebase.init';
import { AuthContext } from './AuthContext';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

 const signInWithGoogle = () => {
  setLoading(true);
  return signInWithPopup(auth, googleProvider);
};

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const token = await getIdToken(currentUser);
      localStorage.setItem("access-token", token);
      setUser(currentUser); 
    } else {
      localStorage.removeItem("access-token");
      setUser(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);



  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
