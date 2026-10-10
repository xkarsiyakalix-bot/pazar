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
        <div className="fixed inset-0 top-16 bottom-16 sm:bottom-0 sm:relative sm:min-h-screen overflow-y-auto bg-gray-50 dark:bg-neutral-900 pb-4 sm:pb-12 sm:pt-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-0">
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;
