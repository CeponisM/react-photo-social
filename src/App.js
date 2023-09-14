import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as signOutAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import Feed from './components/feed/Feed';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase'; // Import auth and db

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Get a reference to the auth service
  const auth = getAuth();

  // Get a reference to the Firestore database
  const db = getFirestore();

  useEffect(() => {
    // Subscribe to user on auth state changed
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
        fetchUserProfile(authUser.uid);
      } else {
        // User is signed out
        setUser(null);
        setProfile(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  const fetchUserProfile = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      setProfile(docSnapshot.data());
    } else {
      console.log('No such document!');
    }
  };

  const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      console.error('Error signing in', error);
    });
  };

  const signOut = () => {
    signOutAuth(auth).catch((error) => {
      console.error('Error signing out', error);
    });
  };

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={signOut}>Sign Out</button>
          {profile && (
            <div>
              <h1>Welcome, {profile.displayName}!</h1>
              <img src={profile.photoURL} alt="Profile" />
              {/* Display other user profile information */}
            </div>
          )}
          <Feed />
        </>
      ) : (
        <>
          <SignIn onSignIn={signIn} />
          <SignUp onSignUp={setUser} />
        </>
      )}
    </div>
  );
}

export default App;