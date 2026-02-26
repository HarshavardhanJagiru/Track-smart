import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ShieldCheck, Loader2, Search, Trash2, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/auth');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userToDelete) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete the account for ${userToDelete.name}? This will also delete all their jobs and skills.`)) return;

        try {
            await api.delete(`/auth/${userToDelete._id}`);
            setUsers(users.filter(u => u._id !== userToDelete._id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        Admin Command Center <ShieldCheck className="text-primary-500 animate-pulse" size={32} />
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Registered Users: {users.length}</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input !pl-12 h-12 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 grayscale opacity-50">
                    <Loader2 className="animate-spin text-primary-600 mb-4" size={50} />
                    <p className="font-bold text-slate-400 tracking-wider uppercase text-sm">Accessing Member Registry...</p>
                </div>
            ) : (
                <div className="card overflow-hidden !p-0 border-white/20 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Member</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50 bg-white/40">
                                {filteredUsers.map((u, index) => (
                                    <tr
                                        key={u._id}
                                        className="hover:bg-primary-50/30 transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-700 font-black border border-primary-200 shadow-sm text-lg">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-900 text-base">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <Mail size={16} className="text-slate-300" />
                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                <Calendar size={16} className="text-slate-300" />
                                                {formatDate(u.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${u.isAdmin
                                                    ? 'bg-primary-50 text-primary-700 border-primary-100 shadow-sm shadow-primary-200'
                                                    : 'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {u.isAdmin ? 'Administrator' : 'User'}
                                                </span>
                                                {user._id !== u._id && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-4"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
