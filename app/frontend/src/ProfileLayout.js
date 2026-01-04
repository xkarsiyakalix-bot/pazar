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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;
