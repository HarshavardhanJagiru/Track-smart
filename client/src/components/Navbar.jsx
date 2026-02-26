import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass sticky top-0 z-50 backdrop-blur-xl bg-white/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/dashboard" className="flex items-center gap-3 active:scale-95 transition-transform group">
                        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-2.5 rounded-2xl text-white shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                            <Briefcase size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                            SmartJob<span className="text-primary-600">.</span>
                        </span>
                    </Link>

                    {user && (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mr-4 border border-slate-200/50">
                                <Link
                                    to="/dashboard"
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-primary-600 transition-all hover:bg-white hover:border-slate-200"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/skills"
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-primary-600 transition-all hover:bg-white hover:border-slate-200"
                                >
                                    Roadmap
                                </Link>
                                <Link
                                    to="/profile"
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-primary-600 transition-all hover:bg-white hover:border-slate-200"
                                >
                                    Account
                                </Link>
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-primary-600 transition-all hover:bg-white hover:border-slate-200"
                                    >
                                        Admin
                                    </Link>
                                )}
                            </div>

                            <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block" />

                            <div className="flex items-center gap-3 ml-2">
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-700 font-black border border-primary-200 shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
