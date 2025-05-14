// src/components/Shared_components/Login_button.jsx

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = () => {
  const clientId =
    '734717984588-h621pe3pomsbae2ac69qkj16fga93fvs.apps.googleusercontent.com';
  const navigate = useNavigate();

  // mirror your original state
  const [username, setName] = useState('');
  const [userId, setId] = useState('');
  const [email, setEmail] = useState('');

  const onFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const handleSubmit = async (userName, userId, email) => {
    // preserve original state updates
    setName(userName);
    setId(userId);
    setEmail(email);

    // original localStorage items
    // localStorage.setItem('username', userName); // you can uncomment if desired
    localStorage.setItem('userId', userId);
    localStorage.setItem('userId2', String(userId));

    const userData = { username: userName, userId, email };
    console.log('Sending request with data:', userData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      console.log('Response received:', data);

      if (response.ok) {
        // same as original: store returned userData
        localStorage.setItem('userData', JSON.stringify(data.userData));

        // fire-and-forget overdue chores
        fetch(
          `${process.env.REACT_APP_API_URL}/api/chores/checkOverdue/${userId}`,
          { method: 'POST' }
        ).catch(console.error);

        // navigate right away
        navigate('/dashboard');
      } else {
        console.error('Error in registration:', data.message);
      }
    } catch (error) {
      console.error('Error in fetch request:', error);
    }
  };

  // decode and invoke handleSubmit
  const onSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    const token = credentialResponse.credential;
    if (!token) {
      console.error('Credential is missing in the response');
      return;
    }

    const decoded = jwtDecode(token);
    if (!decoded || !decoded.sub || !decoded.name) {
      console.error('Decoded token missing fields:', decoded);
      return;
    }

    const userId = decoded.sub;
    const userName = decoded.name;
    const email = decoded.email;

    console.log('User Info:', decoded);

    handleSubmit(userName, userId, email);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
