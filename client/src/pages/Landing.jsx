import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Activity, CalendarClock, Target, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl hover:border-amber-500/30 transition-all group"
    >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
    </motion.div>
);

const Landing = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-amber-500/30 selection:text-amber-200 flex flex-col transition-colors duration-500">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-amber-600/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-rose-600/10 blur-[120px]" />
                <div className="absolute -bottom-[40%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-600/5 blur-[120px]" />
            </div>

            <Navbar />

            <main className="flex-grow z-10">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wide uppercase mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        The Future of Job Tracking
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-8"
                    >
                        Manage applications with<br />
                        <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                            ruthless precision.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed"
                    >
                        Stop losing opportunities in messy spreadsheets. SmartJob gives you powerful analytics, automated interview reminders, and a stunning interface to conquer your job search.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Link to="/register" className="h-14 px-8 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-1">
                            Start Tracking Free <ChevronRight size={20} />
                        </Link>
                        <Link to="/login" className="h-14 px-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                            Sign In to account
                        </Link>
                    </motion.div>
                </section>

                {/* Scrolling Features Section */}
                <section className="py-24 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to land the offer.</h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Built for ambitious professionals who treat their career like a business.</p>
                    </div>

                    {/* Infinite Scroll Container (Rolling Cards) */}
                    <div className="relative w-full overflow-hidden flex flex-col gap-6">
                        {/* Row 1 */}
                        <div className="flex gap-6 animate-[scroll_40s_linear_infinite] w-max hover:[animation-play-state:paused] px-6">
                            <FeatureCard
                                icon={Activity}
                                title="Visual Pipelines"
                                description="Drag and drop your applications across a beautifully designed Kanban board. See your entire funnel at a glance."
                                delay={0}
                            />
                            <FeatureCard
                                icon={CalendarClock}
                                title="Automated Reminders"
                                description="Never miss an interview. Get intelligent email alerts before your scheduled technical rounds and deadlines."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={Target}
                                title="Real-time Analytics"
                                description="Track your conversion rates, identify bottlenecks, and optimize your application strategy with deep insights."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={Briefcase}
                                title="Portfolio Roadmaps"
                                description="Link technical skills directly to roles. Identify what you need to learn to land your dream architecture positions."
                                delay={0.3}
                            />
                        </div>

                        {/* Row 2 (Reverse direction for effect if desired, or just offset) */}
                        <div className="flex gap-6 animate-[scroll_45s_linear_infinite_reverse] w-max hover:[animation-play-state:paused] px-6 ml-[-20%]">
                            <FeatureCard
                                icon={Zap}
                                title="Lightning Fast"
                                description="Built on a modern React architecture ensuring every interaction is immediate and fluid."
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={CheckCircle2}
                                title="Verified Accounts"
                                description="Secure email verification ensuring your data and tracking history remains completely private."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={Activity}
                                title="Visual Pipelines"
                                description="Drag and drop your applications across a beautifully designed Kanban board. See your entire funnel at a glance."
                                delay={0.6}
                            />
                            <FeatureCard
                                icon={CalendarClock}
                                title="Automated Reminders"
                                description="Never miss an interview. Get intelligent email alerts before your scheduled technical rounds and deadlines."
                                delay={0.7}
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="z-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 py-12 text-center md:text-left transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Briefcase size={24} className="text-amber-500" />
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">SmartJob<span className="text-amber-500">.</span></span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} SmartJob Tracker. Built for excellence.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
