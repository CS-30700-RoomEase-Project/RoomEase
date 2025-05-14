// src/components/Shared_components/Login_button.jsx

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = () => {
  const clientId =
    '734717984588-h621pe3pomsbae2ac69qkj16fga93fvs.apps.googleusercontent.com';
  const navigate = useNavigate();

  const onFailure = (error) => {
    console.error('Login Failed:', error);
  };

  // fire-and-forget overdue check
  const checkOverdueChores = async (userId) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chores/checkOverdue/${userId}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      const body = await resp.json();
      console.log('Overdue chores check:', body);
    } catch (err) {
      console.error('Error checking overdue chores:', err);
    }
  };

  const handleSubmit = async (userName, userId, email) => {
    // mirror original localStorage behavior
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
      console.log('Register response:', data);

      if (!response.ok) {
        console.error('Error in registration:', data.message);
      }
    } catch (err) {
      console.error('Error in fetch request:', err);
    }

    // navigate immediately
    navigate('/dashboard');

    // then kick off overdue check in background
    checkOverdueChores(userId);
  };

  const onSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    const token = credentialResponse.credential;
    if (!token) {
      console.error('Missing credential');
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

    console.log('Decoded User:', { userId, userName, email });
    handleSubmit(userName, userId, email);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
