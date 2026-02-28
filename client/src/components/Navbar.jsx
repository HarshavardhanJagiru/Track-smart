import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/dashboard" className="flex items-center gap-3 active:scale-95 transition-transform group">
                        <div className="bg-gradient-to-br from-primary-500 to-teal-700 p-2.5 rounded-3xl text-white shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                            <Briefcase size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                            SmartJob<span className="text-primary-600">.</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user && (
                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full mr-4 border border-slate-200/50 dark:border-slate-700">
                                    <Link
                                        to="/dashboard"
                                        className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/skills"
                                        className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        Roadmap
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        Account
                                    </Link>
                                </div>

                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />

                                <div className="flex items-center gap-3 ml-2">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-primary-700 dark:text-primary-400 font-black border border-primary-200 dark:border-slate-700 shadow-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {!user && (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors">Sign In</Link>
                                <Link to="/register" className="btn btn-primary px-6 py-2.5 !text-sm whitespace-nowrap">Join Free</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
