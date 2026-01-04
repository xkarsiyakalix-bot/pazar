import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        const checkAdminStatus = async () => {
            let timeoutId;
            try {
                // Timeout promise
                const timeoutPromise = new Promise((_, reject) =>
                    timeoutId = setTimeout(() => reject(new Error('Admin check timeout')), 5000)
                );

                // Check if user is admin (user_number 1001)
                const checkPromise = supabase
                    .from('profiles')
                    .select('user_number')
                    .eq('id', user.id)
                    .single();

                const { data: profile, error } = await Promise.race([checkPromise, timeoutPromise]);
                if (timeoutId) clearTimeout(timeoutId);

                if (error) throw error;

                // Check if user number is 1001
                setIsAdmin(profile?.user_number === 1001);

            } catch (error) {
                if (timeoutId) clearTimeout(timeoutId);
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
