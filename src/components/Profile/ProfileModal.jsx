import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2, Sparkles, Briefcase, GraduationCap } from 'lucide-react';
import { DecisionContext } from '../../context/DecisionContext';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUserProfile, uploadProfileImage } = useContext(DecisionContext);

    const [formData, setFormData] = useState({
        profileImage: '',
        education: '',
        skills: '',
        careerGoals: ''
    });

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                profileImage: user.profileImage || '',
                education: user.education || '',
                skills: user.skills || '',
                careerGoals: user.careerGoals || ''
            });
            setError('');
        }
    }, [user, isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('Image exceeds 2MB limit.');
                return;
            }

            try {
                setUploadingImage(true);
                setError('');

                const uploadData = new FormData();
                uploadData.append('image', file);

                const updatedUser = await uploadProfileImage(uploadData);
                setFormData(prev => ({ ...prev, profileImage: updatedUser.profileImage }));

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to upload image.');
            } finally {
                setUploadingImage(false);
                // Clear input so the same file can be selected again if it failed
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!updateUserProfile) return; // safety

        setLoading(true);
        setError('');
        try {
            await updateUserProfile(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={loading ? undefined : onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Decorative background glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 relative z-10">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                User Profile
                            </h2>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6 overflow-y-auto max-h-[70vh] relative z-10">
                            {error && (
                                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-500 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Picker */}
                                <div className="flex flex-col items-center justify-center pt-2 pb-6">
                                    <div
                                        onClick={triggerFilePicker}
                                        className="relative group cursor-pointer w-28 h-28 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-4 ring-white dark:ring-slate-800 overflow-hidden"
                                    >
                                        {uploadingImage ? (
                                            <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                                <Loader2 className="animate-spin mb-1" size={24} />
                                                <span className="text-xs font-medium">Uploading...</span>
                                            </div>
                                        ) : formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                                                {user?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        {/* Overlay Overlay on Hover (hide if uploading) */}
                                        {!uploadingImage && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                                <Camera className="text-white" size={28} />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <p className="mt-4 text-xl font-bold text-slate-800 dark:text-white text-center">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-0.5">
                                        {user?.email || ''}
                                    </p>
                                </div>

                                {/* Inputs */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                                            <GraduationCap size={16} className="text-primary" />
                                            Education
                                        </label>
                                        <input
                                            type="text"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            placeholder="e.g. 3rd Year CS at LPU"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                                            <Sparkles size={16} className="text-secondary" />
                                            Skills
                                        </label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g. React, Node.js, Python"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                                            <Briefcase size={16} className="text-emerald-500" />
                                            Career Goals
                                        </label>
                                        <textarea
                                            name="careerGoals"
                                            value={formData.careerGoals}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="e.g. Full Stack Developer aiming to work in fintech"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 resize-none"
                                        ></textarea>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            AI uses this context to give highly personalized, strategic advice.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 relative z-10 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl font-medium shadow-[0_0_15px_#8b5cf64d] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    'Save Profile'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
