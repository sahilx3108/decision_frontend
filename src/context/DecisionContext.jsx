import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
    const [decisions, setDecisions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Helper: Determine the best name to display
    // This handles cases where Google gives 'name' but GitHub might give 'login' or 'username'
    const userDisplayName = user ? (user.name || user.username || user.login || user.email?.split('@')[0]) : 'User';

    // Helper to get auth header
    const getAuthHeader = () => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Fetch decisions and logs when token is available
    useEffect(() => {
        const initData = async () => {
            if (token && token !== 'null' && token !== 'undefined') {
                // 1. If we have a token but no user data (e.g., page refresh), fetch the user FIRST
                if (!user) {
                    try {
                        const res = await axios.get('http://localhost:5000/api/auth/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        // Save the fresh user data (containing name/email)
                        setUser(res.data);
                        localStorage.setItem('user', JSON.stringify(res.data));
                    } catch (err) {
                        console.error('Failed to validate token on load:', err);
                        logout();
                        return;
                    }
                }

                // 2. Then fetch app data
                fetchDecisions();
                fetchLogs();
            } else {
                setDecisions([]);
                setLogs([]);
            }
        };
        initData();
    }, [token]);

    // --- Authentication Methods ---

    // Manual Login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, ...userData } = res.data;

            setToken(token);
            setUser(userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // OAuth Login (Google/GitHub)
    // Call this function from your OAuthCallback page/component
    const loginWithToken = async (newToken) => {
        setLoading(true);
        try {
            // 1. Fetch the REAL user data immediately using the new token
            // This ensures we get the 'name', 'avatar', etc. from the backend before the UI renders
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${newToken}` }
            });

            const userData = res.data;

            // 2. Set user state with the fetched profile (containing the name)
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // 3. Set token state
            setToken(newToken);
            localStorage.setItem('token', newToken);

            setError(null);
        } catch (err) {
            console.error('Failed to fetch user data for OAuth token:', err);
            setError('Failed to load user profile');
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            const { token, ...userData } = res.data;

            setToken(token);
            setUser(userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setDecisions([]);
        setLogs([]);
    };

    // --- Data Methods ---

    const fetchDecisions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/entity', getAuthHeader());
            setDecisions(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/logs', getAuthHeader());
            setLogs(res.data);
        } catch (err) {
            console.error('Error fetching logs:', err);
        }
    };

    const addDecision = async (decisionData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/entity', decisionData, getAuthHeader());
            setDecisions([res.data, ...decisions]);
            fetchLogs();
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding decision');
            throw err;
        }
    };

    const updateDecision = async (id, updatedData) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/entity/${id}`, updatedData, getAuthHeader());
            setDecisions(decisions.map(dec => dec._id === id ? res.data : dec));
            fetchLogs();
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating decision');
            throw err;
        }
    };

    const deleteDecision = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/entity/${id}`, getAuthHeader());
            setDecisions(decisions.filter(dec => dec._id !== id));
            fetchLogs();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting decision');
            throw err;
        }
    };

    // --- User Management Methods ---

    const updateUserProfile = async (profileData) => {
        try {
            const res = await axios.put('http://localhost:5000/api/user/profile', profileData, getAuthHeader());
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            console.error('Error updating profile:', err);
            throw err;
        }
    };

    const uploadProfileImage = async (formData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/user/profile/upload-image', formData, {
                headers: {
                    ...getAuthHeader().headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedUser = { ...user, profileImage: res.data.profileImage };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            console.error('Error uploading profile image:', err);
            throw err;
        }
    };

    const deleteAccount = async () => {
        try {
            await axios.delete('http://localhost:5000/api/user/account', getAuthHeader());
            logout(); // Log the user out and clear state after successful deletion
        } catch (err) {
            console.error('Error deleting account:', err);
            throw err;
        }
    };

    const contextValue = {
        user,
        userDisplayName, // Use this in your Navbar instead of user.name
        token,
        decisions,
        logs,
        loading,
        error,
        login,
        loginWithToken,
        register,
        logout,
        addDecision,
        updateDecision,
        deleteDecision,
        fetchDecisions,
        fetchLogs,
        updateUserProfile,
        uploadProfileImage,
        deleteAccount,
    };

    return (
        <DecisionContext.Provider value={contextValue}>
            {children}
        </DecisionContext.Provider>
    );
};





