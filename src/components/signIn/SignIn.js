import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase'; // Import auth

function SignIn(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const provider = new GoogleAuthProvider();

  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        props.onSignIn(user);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alert('No user found with this email. Please sign up first.');
        } else {
          console.error('Error signing in', error);
        }
      });
    setEmail('');
    setPassword('');
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        props.onSignIn(user);
      }).catch((error) => {
        console.error('Error signing in with Google', error);
      });
  };

  return (
    <div>
      <h2>Sign In</h2>
      < p/>
        FOR TESTING USE:
        <p />
        user: "test@test.com"
        <p />
        pass: "testing"
        < p/>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        < p/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        < p/>
        <button type="submit">Sign In</button> &nbsp;
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      </form>
    </div>
  );
}

export default SignIn;