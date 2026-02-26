import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertTriangle, User, Loader2, CheckCircle2 } from 'lucide-react';
import { DecisionContext } from '../context/DecisionContext';

const Settings = () => {
    const { user, deleteAccount } = useContext(DecisionContext);



    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Helpers
    const isLocalUser = !user?.authProvider || user?.authProvider === 'local';


    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await deleteAccount();
        } catch (error) {
            console.error('Failed to delete account', error);
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your security and account preferences.</p>
            </header>

            <div className="space-y-8">
                {/* Account Information Section */}
                <section className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <User className="text-primary" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Account Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 cursor-not-allowed opacity-80">
                                {user?.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Sign-in Method</label>
                            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 cursor-not-allowed opacity-80 capitalize flex items-center gap-2">
                                {isLocalUser ? 'Email & Password' : user?.authProvider} Account
                            </div>
                        </div>
                    </div>
                    {!isLocalUser && (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            Because you signed in with {user?.authProvider}, your password and authentication are managed by them.
                        </p>
                    )}
                </section>


                {/* Danger Zone */}
                <section className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-500/10 rounded-xl">
                            <AlertTriangle className="text-rose-500" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-rose-600 dark:text-rose-500">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
                        Once you delete your account, there is no going back. Please be certain. All your data, decisions, history, and AI strategies will be permanently wiped.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-colors shadow-sm"
                    >
                        Delete Account
                    </button>
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => !deleteLoading && setShowDeleteModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mb-4 text-rose-500">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={deleteLoading}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleteLoading}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : 'Yes, delete account'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;
