import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
                {/* Animated Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold tracking-wide"
                >
                    v2.0 Beta Now Available
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    Next-Generation <br className="hidden md:block" />
                    <span className="text-gradient">Decision Intelligence App</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl"
                >
                    Empower your team with AI-driven insights. Transform complex data into clear, actionable strategies with our futuristic analytics platform.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/dashboard">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3.5 rounded-lg bg-primary text-white font-medium glow-button overflow-hidden relative group"
                        >
                            <span className="relative z-10">Get Started Free</span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.button>
                    </Link>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3.5 rounded-lg glassmorphism text-slate-300 hover:text-white font-medium transition-colors duration-300"
                    >
                        Book a Demo
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
