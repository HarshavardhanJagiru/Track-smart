import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, BookOpen, CheckCircle, Clock, Trash2, Edit2, Loader2, Sparkles } from 'lucide-react';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        status: 'Need to Learn',
        proficiency: 0,
        notes: '',
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await api.get('/skills');
            setSkills(res.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill._id}`, formData);
            } else {
                await api.post('/skills', formData);
            }
            setIsModalOpen(false);
            setEditingSkill(null);
            setFormData({ name: '', status: 'Need to Learn', proficiency: 0, notes: '' });
            fetchSkills();
        } catch (error) {
            console.error('Error saving skill:', error);
        }
    };

    const handleLevelUp = async (skill) => {
        const newProficiency = Math.min(skill.proficiency + 10, 100);
        const newStatus = newProficiency === 100 ? 'Learnt' : skill.status === 'Need to Learn' ? 'Learning' : skill.status;

        try {
            await api.put(`/skills/${skill._id}`, { ...skill, proficiency: newProficiency, status: newStatus });
            fetchSkills();
        } catch (error) {
            console.error('Error leveling up skill:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this skill?')) {
            try {
                await api.delete(`/skills/${id}`);
                fetchSkills();
            } catch (error) {
                console.error('Error deleting skill:', error);
            }
        }
    };

    const openEditModal = (skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            status: skill.status,
            proficiency: skill.proficiency,
            notes: skill.notes || '',
        });
        setIsModalOpen(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Learnt': return <CheckCircle className="text-green-500" size={18} />;
            case 'Learning': return <Clock className="text-blue-500" size={18} />;
            default: return <BookOpen className="text-amber-500" size={18} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Learnt': return 'bg-green-50 text-green-700 border-green-100';
            case 'Learning': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    const getProficiencyBadge = (level) => {
        if (level < 25) return { label: 'Novice', color: 'bg-slate-100 text-slate-600' };
        if (level < 50) return { label: 'Intermediate', color: 'bg-blue-100 text-blue-700' };
        if (level < 75) return { label: 'Advanced', color: 'bg-purple-100 text-purple-700' };
        return { label: 'Expert', color: 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' };
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                        Skill Roadmap <Sparkles className="text-primary-500 animate-pulse" size={32} />
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">Bridge the gap with visual milestones</p>
                </div>
                <button
                    onClick={() => { setEditingSkill(null); setFormData({ name: '', status: 'Need to Learn', proficiency: 0, notes: '' }); setIsModalOpen(true); }}
                    className="btn btn-primary flex items-center justify-center gap-2 px-8 py-3 shadow-xl shadow-primary-500/20"
                >
                    <Plus size={20} />
                    Add New Skill
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                        <Loader2 className="animate-spin text-primary-600" size={60} />
                        <Sparkles className="absolute inset-0 m-auto text-primary-400 animate-ping" size={24} />
                    </div>
                    <p className="mt-6 font-bold text-slate-400 tracking-wider uppercase text-sm">Synchronizing Roadmap...</p>
                </div>
            ) : skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill, index) => (
                        <div
                            key={skill._id}
                            className="card group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 animate-in zoom-in duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusClass(skill.status)} flex items-center gap-2 uppercase tracking-wide`}>
                                    {getStatusIcon(skill.status)}
                                    {skill.status}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(skill)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(skill._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors tracking-tight">{skill.name}</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mastery Level</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${getProficiencyBadge(skill.proficiency).color}`}>
                                                {getProficiencyBadge(skill.proficiency).label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-primary-600 font-bold">{skill.proficiency}%</span>
                                            {skill.proficiency < 100 && (
                                                <button
                                                    onClick={() => handleLevelUp(skill)}
                                                    className="px-2 py-1 text-[10px] font-bold bg-primary-50 text-primary-700 rounded hover:bg-primary-100 transition-colors"
                                                    title="Quick Level Up (+10%)"
                                                >
                                                    +10%
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 mt-2">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${skill.status === 'Learnt' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                                                }`}
                                            style={{ width: `${skill.proficiency}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                        </div>
                                    </div>
                                </div>
                                {skill.notes && (
                                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 relative">
                                        <div className="absolute -top-2 -left-2 text-slate-200">
                                            <Sparkles size={16} />
                                        </div>
                                        <p className="text-sm text-slate-600 italic">"{skill.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-24 bg-white/50 border-dashed border-2 animate-in zoom-in duration-700">
                    <div className="mx-auto w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-300 mb-6 group-hover:rotate-12 transition-transform">
                        <BookOpen size={40} className="text-primary-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No milestones explored</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Start documenting the skills you're learning or planning to master for your dream role.</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary px-10 py-4 shadow-xl shadow-primary-500/20">
                        Add Your First Skill
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-300">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Skill Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input w-full"
                                    placeholder="e.g. React, Python, AWS"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                                <select
                                    className="input w-full"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Need to Learn">Need to Learn</option>
                                    <option value="Learning">Learning</option>
                                    <option value="Learnt">Learnt</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Proficiency ({formData.proficiency}%)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    value={formData.proficiency}
                                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    className="input w-full h-24 resize-none"
                                    placeholder="Resources, goals, or small progress updates..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    {editingSkill ? 'Save Changes' : 'Add Skill'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
