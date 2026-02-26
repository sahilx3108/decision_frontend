import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

const DecisionCard = ({ decision, onDelete, onEdit, index }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group bg-white/70 dark:bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-sm dark:shadow-none"
        >
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(decision.status)}`}>
                        {decision.status}
                    </span>
                    {/* Contextual Actions (Hover) */}
                    <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(decision);
                            }}
                            className="p-2 bg-white/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-slate-500 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400 rounded-lg backdrop-blur-sm border border-slate-200 dark:border-white/10 transition-colors shadow-sm dark:shadow-none"
                            title="Edit Decision"
                        >
                            <Edit size={16} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(decision._id);
                            }}
                            className="p-2 bg-white/90 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 dark:text-slate-300 dark:hover:text-rose-400 rounded-lg backdrop-blur-sm border border-slate-200 dark:border-white/10 transition-colors shadow-sm dark:shadow-none"
                            title="Delete Decision"
                        >
                            <Trash2 size={16} />
                        </motion.button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mb-4 flex-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5 line-clamp-1">{decision.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{decision.description}</p>
                </div>

                {/* Footer info */}
                <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-500 pt-3 border-t border-slate-200 dark:border-white/5">
                    <span className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400">{decision.category}</span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${decision.priority === 'Critical' ? 'bg-rose-500' : decision.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                        {decision.priority}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default DecisionCard;
