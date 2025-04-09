"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Home, User, Settings, Brain } from 'lucide-react';
import { AccountScreen } from '@/components/profile-component';
import { SettingsScreen } from '@/components/settings-component';
import dynamic from 'next/dynamic';
import { HomeComponent } from '@/components/home-component';
import { motion } from 'framer-motion';

const TabNav = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ensure code only runs in the browser
    if (typeof window !== "undefined") {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login'); // Redirect if not authenticated
        } else {
          setIsAuthenticated(true);
        }
        setLoading(false);
      };

      checkAuth();
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Prevents UI flickering before redirect
  }

  const tabs = [
    { id: 'home', label: 'Quiz', icon: Brain },
    { id: 'account', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Render the appropriate component based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeComponent />;
      case 'account':
        return <AccountScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeComponent />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <motion.div 
        className="flex-1 bg-gradient-to-br from-purple-50 via-white to-indigo-50 overflow-auto pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {renderContent()}
      </motion.div>
      
      <motion.div 
        className="fixed bottom-0 inset-x-0 z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="bg-white/80 backdrop-blur-sm border-t border-purple-100 shadow-lg">
          <div className="flex justify-between max-w-md mx-auto px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  className={`flex flex-col items-center justify-center py-3 px-5 relative
                    ${isActive ? 'text-purple-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-purple-100 rounded-lg -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TabNav;
