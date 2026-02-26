import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart2, Settings, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { DecisionContext } from '../../context/DecisionContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { logout } = useContext(DecisionContext);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Analytics', icon: BarChart2, path: '/analytics' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border-r border-slate-200 dark:border-white/10 flex flex-col md:translate-x-0 transition-all duration-300 ease-in-out ${!isOpen && 'max-md:-translate-x-full max-md:opacity-0'
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-white/10">
                    <Link to="/" className="text-xl font-bold text-gradient">
                        Decision Intel
                    </Link>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={toggleSidebar} className="md:hidden text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white">
                        <X size={24} />
                    </motion.button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 shadow-[0_0_15px_#8b5cf61a] dark:shadow-[0_0_15px_#8b5cf64d]'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
