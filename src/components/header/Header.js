import React from 'react';
import { getAuth, signOut as signOutAuth } from 'firebase/auth';
import { auth } from '../../firebase'; // Import auth

function Header(props) {
  const signOut = () => {
    signOutAuth(auth)
      .then(() => {
        // Sign-out successful.
        props.onSignOut();
      })
      .catch((error) => {
        // An error happened.
        console.error('Error signing out', error);
      });
  };

  return (
    <div>
      <h1>Instagram Clone</h1>
      {props.user && <button onClick={signOut}>Sign Out</button>}
    </div>
  );
}

export default Header;