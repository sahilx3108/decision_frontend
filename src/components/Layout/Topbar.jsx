import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Topbar = ({ toggleSidebar, userName, profileImage, onAvatarClick }) => {
    return (
        <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                    <Menu size={24} />
                </button>

                <h2 className="text-xl font-semibold hidden sm:block text-slate-700 dark:text-slate-200">
                    Welcome back, <span className="text-slate-900 dark:text-white">{userName}</span>
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                <div
                    onClick={onAvatarClick}
                    className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-sm font-bold shadow-[0_0_10px_#8b5cf680] cursor-pointer overflow-hidden border border-transparent hover:border-white/50 transition-all group"
                >
                    {profileImage ? (
                        <img src={profileImage} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <span className="text-white">{userName?.charAt(0) || 'U'}</span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
