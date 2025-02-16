import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage.tsx
 *
 * Uses fetch to call backend endpoints that should be backed by Prisma logic.
 * Replace the `/api/signup` and `/api/login` URLs as needed.
 */

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isNewUser) {
                // ----- SIGN UP -----
                // Call the /api/signup endpoint with username, password
                // The backend dev will handle creating user in DB via Prisma
                const signupResponse = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!signupResponse.ok) {
                    // The backend can respond with an error message
                    const errorData = await signupResponse.json();
                    alert(errorData.message || 'Sign up failed');
                    return;
                }

                alert('User created successfully!');
                setIsNewUser(false);

            } else {
                // ----- LOGIN -----
                // Call the /api/login endpoint
                const loginResponse = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!loginResponse.ok) {
                    const errorData = await loginResponse.json();
                    alert(errorData.message || 'Login failed');
                    return;
                }

                alert('Login successful!');
                // Example: you might store a JWT or session ID here
                // Then navigate to your main page
                navigate('/home');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            // Clear input fields
            setUsername('');
            setPassword('');
        }
    };

    return (
        <div style={styles.container}>
            <h2>{isNewUser ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    {isNewUser ? 'Create Account' : 'Login'}
                </button>
            </form>

            <p style={styles.toggleText}>
                {isNewUser ? 'Already have an account?' : 'New user?'}{' '}
                <button type="button" onClick={() => setIsNewUser(!isNewUser)}>
                    {isNewUser ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: 300,
        margin: '0 auto',
        marginTop: 50,
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 6,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 8,
        boxSizing: 'border-box',
    },
    button: {
        padding: 10,
        cursor: 'pointer',
    },
    toggleText: {
        marginTop: 10,
        textAlign: 'center',
    },
};

export default LoginPage;