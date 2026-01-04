import React, { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function AuthDebugPage() {
    const { user, loading } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        console.log('=== AUTH DEBUG ===');
        console.log('User from context:', user);
        console.log('Loading:', loading);

        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session from Supabase:', session);

        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        console.log('User from Supabase:', supabaseUser);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded">
                        <h3 className="font-semibold mb-2">Auth Context:</h3>
                        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
                        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
                    </div>

                    <div className="p-4 bg-blue-100 rounded">
                        <h3 className="font-semibold mb-2">User Email:</h3>
                        <p>{user?.email || 'Not logged in'}</p>
                    </div>

                    <div className="p-4 bg-green-100 rounded">
                        <h3 className="font-semibold mb-2">User ID:</h3>
                        <p>{user?.id || 'Not logged in'}</p>
                    </div>

                    <button
                        onClick={checkAuth}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refresh Auth Status
                    </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-100 rounded">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Open browser console (F12)</li>
                        <li>Check the console logs</li>
                        <li>Try logging in from /login</li>
                        <li>Come back here and click "Refresh Auth Status"</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default AuthDebugPage;
