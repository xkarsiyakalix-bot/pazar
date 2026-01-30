import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const PresenceTracker = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Generate a unique ID for the session to avoid duplicate tracking of the same device
        // but allow tracking of multiple people
        const sessionId = localStorage.getItem('presence_session_id') || Math.random().toString(36).substr(2, 9);
        localStorage.setItem('presence_session_id', sessionId);

        const channel = supabase.channel('site-presence', {
            config: {
                presence: {
                    key: user?.id || `guest-${sessionId}`,
                },
            },
        });

        let presenceInterval;

        const trackPresence = async () => {
            if (channel.state === 'joined') {
                await channel.track({
                    online_at: new Date().toISOString(),
                    user_type: user ? 'registered' : 'guest',
                    user_email: user?.email || 'Guest',
                });
            }
        };

        channel
            .on('presence', { event: 'sync' }, () => {
                // Sync event
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await trackPresence();

                    // Set up a heartbeat to re-track presence every 60 seconds
                    // This helps maintain the connection and handle potential "flickering"
                    presenceInterval = setInterval(trackPresence, 60000);
                }
            });

        return () => {
            if (presenceInterval) clearInterval(presenceInterval);
            channel.unsubscribe();
        };
    }, [user]);

    return null;
};

export default PresenceTracker;
