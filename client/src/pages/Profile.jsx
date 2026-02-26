import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, ShieldCheck, Trash2, AlertTriangle, ShieldAlert, KeyRound } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteAccount = async () => {
        if (confirmEmail !== user.email) return;

        try {
            setIsDeleting(true);
            await api.delete(`/auth/${user._id}`);
            logout();
            navigate('/register');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] text-white mb-6 shadow-2xl shadow-primary-500/30 animate-float">
                    <User size={60} strokeWidth={1.5} />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                    Command Center
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Manage your career workspace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-2 space-y-8">
                    <div className="card glass !p-8 border-white/40">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            Account Identity <ShieldCheck className="text-primary-500" size={24} />
                        </h2>

                        <div className="space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
                                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary-600">
                                        <User size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-slate-700">{user.name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary-600">
                                        <Mail size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-slate-700">{user.email}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Workspace Authorization</label>
                                <div className="flex items-center gap-4 p-4 bg-primary-50/30 rounded-2xl border border-primary-100">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-primary-700">
                                        {user.isAdmin ? 'Grand Master (Admin)' : 'Standard User Member'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-8">
                    <div className="card border-red-100 bg-red-50/30 !p-8 shadow-red-500/5 transition-all hover:shadow-red-500/10">
                        <div className="flex items-center gap-3 text-red-600 mb-6">
                            <ShieldAlert size={28} />
                            <h2 className="text-xl font-black uppercase tracking-tighter">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-8 leading-relaxed">
                            Deleting your workspace is <span className="text-red-600 font-black">permanent</span>. All tracked jobs and skills will be purged instantly.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 rounded-2xl bg-white border-2 border-red-500 text-red-600 font-black hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 flex items-center justify-center gap-3 active:scale-95"
                        >
                            <Trash2 size={20} />
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="card max-w-md w-full !p-10 border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-[2rem] text-red-600 mx-auto mb-8 shadow-inner">
                            <AlertTriangle size={40} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black text-center text-slate-900 mb-4 tracking-tighter">Final Warning</h3>
                        <p className="text-slate-500 text-center font-medium mb-8">
                            To finalize account termination, please type your email <span className="text-slate-900 font-black px-1.5 py-0.5 bg-slate-100 rounded-md select-none">{user.email}</span> below.
                        </p>

                        <div className="space-y-6">
                            <input
                                type="text"
                                className="input h-14 !text-center font-bold !border-red-100 focus:!border-red-500"
                                placeholder="Verify your identity"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setIsModalOpen(false); setConfirmEmail(''); }}
                                    className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 rounded-2xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={confirmEmail !== user.email || isDeleting}
                                    className="flex-3 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/20 disabled:opacity-30 disabled:shadow-none hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? 'Terminating...' : 'Yes, Delete Permanently'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
