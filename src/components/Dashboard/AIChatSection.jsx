import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, User as UserIcon, Sparkles, ArrowLeft } from 'lucide-react';

const AIChatSection = ({ initialAdvice, decisionsContext, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am ready to discuss the strategy insight above or any of your decisions in more detail. What would you like to know?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                messages: newMessages,
                context: {
                    initialAdvice,
                    decisionsContext: decisionsContext.map(d =>
                        `Title: ${d.title}\nCategory: ${d.category}\nStatus: ${d.status}\nDescription: ${d.description}\n`
                    ).join('---\n')
                }
            };

            // Using axios to maintain consistency with the rest of the application
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`, payload, config);

            const aiMessage = { role: 'assistant', content: res.data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error while processing your request. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 shrink-0 shadow-sm relative z-10 w-full lg:pl-[272px]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 shadow-sm shrink-0"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} className="text-slate-700 dark:text-slate-200" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-500 hidden sm:block">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-tight">Strategy Chat</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Contextual AI Assistant</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 h-0 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-indigo-500/20 text-indigo-500'}`}>
                                {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                            </div>
                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-tr-sm shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                                }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.content.split('**').map((part, i) =>
                                        i % 2 === 1 ? <strong key={i} className="font-bold text-inherit">{part}</strong> : part
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full shrink-0 bg-indigo-500/20 text-indigo-500">
                                <Sparkles size={16} />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex gap-1">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Chat Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-white/5 shrink-0 shadow-[0_-4px_20px_#00000005] dark:shadow-[0_-4px_20px_#00000020]">
                <div className="max-w-4xl mx-auto w-full">
                    <form onSubmit={handleSend} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            disabled={loading}
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors disabled:opacity-50 shadow-inner"
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_#6366f14d]"
                        >
                            <Send size={20} className="mr-2" />
                            <span className="font-medium hidden sm:inline">Send</span>
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default AIChatSection;
