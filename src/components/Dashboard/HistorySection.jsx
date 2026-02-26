import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Edit3, Activity } from 'lucide-react';
import { DecisionContext } from '../../context/DecisionContext';
import { formatDistanceToNow } from 'date-fns'; // Using standard date formatting concept

const HistorySection = () => {
    const { logs } = useContext(DecisionContext);

    const getLogIcon = (action) => {
        switch (action) {
            case 'CREATED_DECISION': return <PlusCircle size={16} className="text-emerald-400" />;
            case 'DELETED_DECISION': return <Trash2 size={16} className="text-rose-400" />;
            case 'UPDATED_DECISION': return <Edit3 size={16} className="text-blue-400" />;
            default: return <Activity size={16} className="text-slate-400" />;
        }
    };

    const getLogMessage = (log) => {
        const title = log.entityId?.title || 'Unknown Decision';
        switch (log.action) {
            case 'CREATED_DECISION': return `Created new decision "${title}"`;
            case 'DELETED_DECISION': return `Deleted decision "${title}"`;
            case 'UPDATED_DECISION': return `Updated decision "${title}"`;
            default: return `Performed action on "${title}"`;
        }
    };

    // Temporary naive date distance formatter string fallback if date-fns isn't imported
    const formatTimeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/5 h-full shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Action History
                </h2>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">No recent activity.</p>
                ) : (
                    logs.map((log, index) => (
                        <motion.div
                            key={log._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-primary/50"
                        >
                            <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-black/20 mt-1">
                                {getLogIcon(log.action)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                                    {getLogMessage(log)}
                                </p>
                                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                                    {formatTimeAgo(log.timestamp)}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistorySection;
