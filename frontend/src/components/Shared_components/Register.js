import { useState } from 'react';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Handles the form submission for user registration.
     *
     * @param {Event} e - The event object from the form submission.
     * @returns {Promise<void>} - A promise that resolves when the form submission is complete.
     */
    const handleSubmit = async () => {
        const userName = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        
        setName(userName); // state update for UI purposes
        setId(userId);
    
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
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to register user");
            }
    
            // Redirect after successful login
            navigate('/dashboard');
        } catch (error) {
            console.error("Error in fetch request:", error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
