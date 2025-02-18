import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = () => {
    const clientId = '734717984588-h621pe3pomsbae2ac69qkj16fga93fvs.apps.googleusercontent.com'; // Replace with your actual Client ID

    const [username, setName] = useState('');
    const [userId, setId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            navigate('/dashboard'); // Redirect if already signed in
        }
    }, [userId, navigate]);

    const onFailure = (error) => {
        console.error('Login Failed:', error);
    };

    const handleSubmit = async (userName, userId) => {
        setName(userName);
        setId(userId);
    
        // Store user info in localStorage temporarily (before backend response)
        // localStorage.setItem('username', userName);
        // localStorage.setItem('userId', userId);
    
        const userData = { username: userName, userId };
        console.log("Sending request with data:", userData);
        
        try {
            const response = await fetch('http://localhost:5001/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
        
            const data = await response.json();
            console.log("Response received:", data);
        
            if (response.ok) {
                // Store the full user data returned from the backend in localStorage
                localStorage.setItem('userData', JSON.stringify(data.userData)); // Store the user data here
                navigate('/dashboard');
            } else {
                console.error("Error in registration:", data.message);
            }
        } catch (error) {
            console.error("Error in fetch request:", error);
        }
    };
    

    const onSuccess = (response) => {
        console.log('Login Success:', response);
    
        if (!response.credential) {
            console.error("Credential is missing in the response");
            return;
        }
    
        // Decode JWT token
        const decodedUser = jwtDecode(response.credential);
    
        if (!decodedUser || !decodedUser.sub || !decodedUser.name) {
            console.error("Decoded user information is incomplete:", decodedUser);
            return;
        }
    
        console.log('User Info:', decodedUser);
    
        const userId = decodedUser.sub;
        const userName = decodedUser.name;
    
        handleSubmit(userName, userId);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                {!userId ? (
                    <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
                ) : (
                    <p>Redirecting...</p>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleSignIn;
