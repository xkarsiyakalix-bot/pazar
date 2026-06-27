import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { t } from '../../translations';
import { getListingUrl } from '../../utils/slug';

export const Header = ({ followedSellers = [], setSelectedCategory }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  // Fetch user profile for display name
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('../../api/profile');
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch counts and notifications (Condensed for brevity, in real app keep the current logic)
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
       try {
          const { getUnreadCount } = await import('../../api/messages');
          const { getNotificationCount, getUnreadNotifications } = await import('../../api/notifications');
          setUnreadCount(await getUnreadCount());
          setNotificationCount(await getNotificationCount());
          setNotifications(await getUnreadNotifications());
       } catch (e) {
          console.error("Error fetching header data", e);
       }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="glass fixed w-full top-0 z-50 border-b border-neutral-200/50 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory(t.categories.all);
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer flex-shrink-0 px-2 sm:px-4 py-2 rounded-xl flex items-center gap-2 group"
          >
            <img
              src="/logo_exvitrin_2026_small.png"
              alt="ExVitrin Logo"
              width="120"
              height="48"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              exvitrin
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                {(userProfile?.is_admin || user.email === 'kerem_aydin@aol.com') && (
                  <button onClick={() => navigate('/admin')} className="p-2 hover:bg-red-50 rounded-lg">Admin</button>
                )}
                <span className="font-semibold text-neutral-700">Merhaba, {userProfile?.full_name || 'Kullanıcı'}</span>
                <button onClick={handleLogout} className="text-sm text-red-600">Çıkış</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-gradient-premium text-white rounded-full">Giriş Yap</button>
              </div>
            )}
          </div>
      </div>
    </header>
  );
};
