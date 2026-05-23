import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

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

        const initAuth = async () => {
            const timeoutId = setTimeout(() => {
                if (mounted && loading) {
                    setLoading(false);
                }
            }, 5000);

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (mounted) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            } catch (error) {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            }
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    const currentUser = session?.user ?? null;
                    setUser(currentUser);
                    setLoading(false);

                    if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
                        checkBanStatus(currentUser.id);
                    }
                }
            }
        );

        return () => {
            mounted = false;
            if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    // Effect for Presence and Last Seen
    useEffect(() => {
        if (!user) {
            // Guest Presence
            let guestId = sessionStorage.getItem('presence_guest_id');
            if (!guestId) {
                guestId = `guest-${Math.random().toString(36).substring(7)}`;
                sessionStorage.setItem('presence_guest_id', guestId);
            }

            const channel = supabase.channel('site-presence', {
                config: { presence: { key: guestId } }
            });

            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: 'guest', online_at: new Date().toISOString() });
                }
            });

            return () => { channel.unsubscribe(); };
        } else {
            // Logged-in User Presence & Activity
            const channel = supabase.channel('site-presence', {
                config: { presence: { key: user.id } }
            });

            const updateActivity = async () => {
                await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', user.id);
            };

            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
                    updateActivity();
                }
            });

            const heartbeat = setInterval(updateActivity, 1000 * 60 * 5); // 5 mins

            return () => {
                channel.unsubscribe();
                clearInterval(heartbeat);
            };
        }
    }, [user?.id]);

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
            setUser(null);
            localStorage.removeItem('user');
            if (error) {
                console.error("Sign out error:", error);
            }
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
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
