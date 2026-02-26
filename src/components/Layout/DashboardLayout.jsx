import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { DecisionContext } from '../../context/DecisionContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ProfileModal from '../Profile/ProfileModal';

const DashboardLayout = () => {
    const { user } = useContext(DecisionContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-primary/30 transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-col flex-1 w-full min-w-0 flex overflow-hidden relative">
                {/* Decorative background glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

                <Topbar
                    toggleSidebar={toggleSidebar}
                    userName={user?.name || 'User'}
                    profileImage={user?.profileImage}
                    onAvatarClick={() => setIsProfileModalOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 w-full">
                    <Outlet />
                </main>
            </div>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default DashboardLayout;
