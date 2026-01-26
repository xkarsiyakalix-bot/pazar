import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

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
                    .select('user_number, is_admin')
                    .eq('id', user.id)
                    .single();

                const { data: profile, error } = await Promise.race([checkPromise, timeoutPromise]);
                if (timeoutId) clearTimeout(timeoutId);

                // Fallback: Check user email directly from auth metadata
                const isSuperAdmin = user.email === 'kerem_aydin@aol.com' || profile?.user_number === 1001 || profile?.is_admin === true;
                setIsAdmin(isSuperAdmin);

                if (error && !isSuperAdmin) {
                    console.warn('Admin status query failed and email check was not matched:', error);
                }

            } catch (error) {
                if (timeoutId) clearTimeout(timeoutId);
                console.error('Failed to check admin status due to an unexpected error or timeout:', error);

                // Final fallback: check user ID or session if metadata allows, 
                // but for now we rely on the successful query or fail safe.
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
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
