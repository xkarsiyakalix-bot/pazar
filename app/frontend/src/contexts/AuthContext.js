import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);



    const checkBanStatus = async (userId) => {
        if (!userId) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error checking ban status:', error);
                return;
            }

            if (data?.status === 'banned') {
                await supabase.auth.signOut();
                setUser(null);
                alert('Ihr Konto wurde gesperrt. Bitte kontaktieren Sie den Support.');
            }
        } catch (err) {
            console.error('Unexpected error checking ban status:', err);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Check active session on mount
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted) {
                    const currentUser = session?.user ?? null;
                    setUser(currentUser);
                    setLoading(false);

                    // Check ban status and update last seen
                    if (currentUser) {
                        checkBanStatus(currentUser.id);
                        // Update online status immediately on mount if logged in
                        supabase
                            .from('profiles')
                            .update({ last_seen: new Date().toISOString() })
                            .eq('id', currentUser.id);
                    }
                }
            } catch (error) {
                console.error('Error getting session:', error);
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    const currentUser = session?.user ?? null;
                    setUser(currentUser);
                    setLoading(false);

                    // Check ban status and update last seen
                    if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
                        checkBanStatus(currentUser.id);
                        // Update online status on these events
                        supabase
                            .from('profiles')
                            .update({ last_seen: new Date().toISOString() })
                            .eq('id', currentUser.id);
                    }
                }
            }
        );

        // Heartbeat: Update last_seen every 5 minutes if user is logged in
        const heartbeat = setInterval(() => {
            if (user) {
                supabase
                    .from('profiles')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('id', user.id);
            }
        }, 1000 * 60 * 5);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearInterval(heartbeat);
        };
    }, []);

    const value = {
        user,
        loading,
        signIn: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },
        signUp: async (email, password, metadata = {}) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                },
            });
            if (error) throw error;
            return data;
        },
        updateLastSeen: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('id', user.id);
            }
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
        resetPassword: async (email) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
        },
        updatePassword: async (newPassword) => {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
