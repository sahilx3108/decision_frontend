import React, { useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, AlertCircle, CheckCircle, Plus, Search, Sparkles } from 'lucide-react';
import SummaryCard from '../components/Dashboard/SummaryCard';
import DecisionCard from '../components/Dashboard/DecisionCard';
import AddDecisionModal from '../components/Dashboard/AddDecisionModal';
import EditDecisionModal from '../components/Dashboard/EditDecisionModal';
import HistorySection from '../components/Dashboard/HistorySection';
import AIChatSection from '../components/Dashboard/AIChatSection';
import { DecisionContext } from '../context/DecisionContext';

const Dashboard = () => {
    const { decisions, loading, error, deleteDecision, addDecision, updateDecision } = useContext(DecisionContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDecision, setEditingDecision] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiAdvice, setAiAdvice] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Derived Statistics
    const totalDecisions = decisions.length;
    const pendingReview = decisions.filter(d => d.status.toLowerCase() === 'pending').length;
    const completedDecisions = decisions.filter(d => d.status.toLowerCase() === 'completed').length;

    // Real-time Search Filter processing
    const filteredDecisions = useMemo(() => {
        if (!searchQuery) return decisions;
        const lowerQuery = searchQuery.toLowerCase();
        return decisions.filter(d =>
            d.title.toLowerCase().includes(lowerQuery) ||
            (d.description && d.description.toLowerCase().includes(lowerQuery))
        );
    }, [decisions, searchQuery]);

    const handleAddDecision = async (data) => {
        try {
            await addDecision(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditDecision = async (id, updatedData) => {
        try {
            await updateDecision(id, updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerateAIStrategy = async () => {
        setLoadingAI(true);
        setAiAdvice('');
        setIsChatOpen(false);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const mappedEntities = decisions.map(d => ({
                Title: d.title,
                Description: d.description,
                Category: d.category,
                Status: d.status
            }));

            const res = await axios.post('http://localhost:5000/api/ai/analyze', { entities: mappedEntities }, config);
            setAiAdvice(res.data.advice);
        } catch (err) {
            console.error("AI Generation Error", err);
            setAiAdvice("Failed to generate AI advice. Please try again later.");
        } finally {
            setLoadingAI(false);
        }
    };

    if (loading && decisions.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-white to-slate-500 dark:to-slate-400">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your operational decisions.</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {/* Real-time Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search decisions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm dark:shadow-none"
                        />
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleGenerateAIStrategy}
                        disabled={loadingAI || decisions.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-[0_0_15px_#6366f166] hover:from-indigo-400 hover:to-purple-500 transition-all w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingAI ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <Sparkles size={20} />
                        )}
                        <span>{loadingAI ? 'Analyzing...' : 'Generate AI Strategy'}</span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium shadow-[0_0_15px_#8b5cf64d] hover:bg-primary/90 transition-all w-full sm:w-auto justify-center"
                    >
                        <Plus size={20} />
                        <span>New Decision</span>
                    </motion.button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-4 rounded-xl">
                    {error}
                </div>
            )}

            {/* AI Insight Card */}
            {aiAdvice && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/50 p-6 rounded-2xl shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400 shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">AI Strategy Insight</h3>
                            <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {aiAdvice.split('**').map((part, index) =>
                                    index % 2 === 1 ? <strong key={index} className="font-bold text-indigo-900 dark:text-indigo-100">{part}</strong> : part
                                )}
                            </div>

                            {!isChatOpen && (
                                <div className="mt-4 pt-2">
                                    <button
                                        onClick={() => setIsChatOpen(true)}
                                        className="text-sm px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors font-medium flex items-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        Chat about that
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            )}

            {/* Grid Layout: Main Stats + Right Sidebar History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Span: Stats and Interactive Cards */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <SummaryCard
                            title="Total Decisions"
                            value={totalDecisions}
                            icon={BarChart3}
                            color="from-primary to-primary/50"
                            delay={0.1}
                        />
                        <SummaryCard
                            title="Pending Review"
                            value={pendingReview}
                            icon={AlertCircle}
                            color="from-amber-500 to-amber-500/50"
                            delay={0.2}
                        />
                        <SummaryCard
                            title="Completed"
                            value={completedDecisions}
                            icon={CheckCircle}
                            color="from-emerald-500 to-emerald-500/50"
                            delay={0.3}
                        />
                    </div>

                    {/* Decisions Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                {searchQuery ? `Search Results (${filteredDecisions.length})` : 'All Decisions'}
                            </h2>
                        </div>

                        {filteredDecisions.length === 0 ? (
                            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-12 text-center rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                                <p className="text-slate-500 dark:text-slate-400 text-lg">
                                    {searchQuery ? 'No decisions match your search.' : 'No decisions found. Create one to get started!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredDecisions.map((decision, index) => (
                                    <DecisionCard
                                        key={decision._id}
                                        decision={decision}
                                        onDelete={deleteDecision}
                                        onEdit={(dec) => setEditingDecision(dec)}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Timeline Activity */}
                <div className="lg:col-span-1">
                    <HistorySection />
                </div>
            </div>

            {/* Add Decision Modal */}
            <AddDecisionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDecision}
            />

            {/* Edit Decision Modal */}
            <EditDecisionModal
                isOpen={!!editingDecision}
                onClose={() => setEditingDecision(null)}
                decision={editingDecision}
                onEdit={handleEditDecision}
            />

            {/* Full-Page AI Chat View */}
            <AnimatePresence>
                {isChatOpen && (
                    <AIChatSection
                        initialAdvice={aiAdvice}
                        decisionsContext={decisions}
                        onClose={() => setIsChatOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
