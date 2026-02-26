import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PREDEFINED_CATEGORIES = [
    'Finance & Budget',
    'Engineering & Tech',
    'Marketing & Growth',
    'HR & Hiring',
    'Operations',
    'Career Development',
    'Education & Learning',
    'Investments & Strategy',
    'Urgent & Firefighting',
    'General Organization',
    'Other'
];

const AddDecisionModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: PREDEFINED_CATEGORIES[0],
        priority: 'Medium',
        description: '',
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ title: '', category: PREDEFINED_CATEGORIES[0], priority: 'Medium', description: '' });
        setIsCustomCategory(false);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categorySelect') {
            if (value === 'Other') {
                setIsCustomCategory(true);
                setFormData({ ...formData, category: '' });
            } else {
                setIsCustomCategory(false);
                setFormData({ ...formData, category: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl transition-colors"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">New Decision</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Decision Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Q4 Budget Allocation"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
                                        Category
                                        {isCustomCategory && (
                                            <button
                                                type="button"
                                                onClick={() => { setIsCustomCategory(false); setFormData({ ...formData, category: PREDEFINED_CATEGORIES[0] }); }}
                                                className="text-xs text-primary hover:text-primary/70"
                                            >
                                                Show List
                                            </button>
                                        )}
                                    </label>
                                    {!isCustomCategory ? (
                                        <select
                                            name="categorySelect"
                                            value={PREDEFINED_CATEGORIES.includes(formData.category) ? formData.category : 'Other'}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                                        >
                                            {PREDEFINED_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="Enter custom category"
                                            autoFocus
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Elaborate on the details of this decision..."
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl text-slate-500 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_#8b5cf64d]"
                                >
                                    Create Decision
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddDecisionModal;
