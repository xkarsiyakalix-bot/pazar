import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProfileLayout = ({ children }) => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pb-24 sm:pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-0 sm:pt-24">
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;
