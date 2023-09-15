import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNav.css'

function BottomNav() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default BottomNav;