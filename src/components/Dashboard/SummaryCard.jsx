import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none"
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-2 bg-gradient-to-r ${color} opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-500`} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/5 mr-1`}>
                    <Icon size={24} className="text-slate-500 dark:text-slate-300" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md font-medium">+12%</span>
                <span className="text-slate-500">from last week</span>
            </div>
        </motion.div>
    );
};

export default SummaryCard;
