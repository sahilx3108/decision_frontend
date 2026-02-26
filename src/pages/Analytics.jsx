import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DecisionContext } from '../context/DecisionContext';

const Analytics = () => {
    const { decisions, loading, error } = useContext(DecisionContext);

    // Data Processing logic
    const { categoryData, weeklyData } = useMemo(() => {
        if (!decisions.length) return { categoryData: [], weeklyData: [] };

        // 1. Process Category Distribution (Pie Chart)
        const categoryCounts = {};
        decisions.forEach(d => {
            categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
        });

        const categories = Object.keys(categoryCounts).map(key => ({
            name: key,
            value: categoryCounts[key]
        }));

        // 2. Process Weekly Activity (Bar Chart)
        // Create an array for the last 7 days starting from today backwards
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        // Group decisions by date map
        const dateCounts = {};
        decisions.forEach(d => {
            const dateStr = new Date(d.createdAt).toISOString().split('T')[0];
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });

        const weekly = last7Days.map(date => {
            // Format to short day name (e.g. "Mon", "Tue")
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return {
                name: dayName,
                decisions: dateCounts[date] || 0
            };
        });

        return { categoryData: categories, weeklyData: weekly };
    }, [decisions]);

    // Theme Colors
    const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-white to-slate-500 dark:to-slate-400">
                    Analytics Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize your decision intelligence data.</p>
            </motion.div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-4 rounded-xl">
                    {error}
                </div>
            )}

            {decisions.length === 0 ? (
                <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-12 text-center rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">No data to analyze yet. Create some decisions first!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Category Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
                    >
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Decision Distribution</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{entry.name} ({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Activity Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
                    >
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Activity (Last 7 Days)</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                                    />
                                    <Bar
                                        dataKey="decisions"
                                        fill="#0ea5e9"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    >
                                        {weeklyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === weeklyData.length - 1 ? '#8b5cf6' : '#0ea5e9'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            )}
        </div>
    );
};

export default Analytics;
