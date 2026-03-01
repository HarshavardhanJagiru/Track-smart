import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';
import AnalyticsChart from '../components/AnalyticsChart';
import BoardView from '../components/BoardView';
import { Plus, Briefcase, Search, Filter, Loader2, Sparkles, Clock, Download, Kanban, List } from 'lucide-react';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        yetToApply: 0,
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'board'
    const [skillStats, setSkillStats] = useState({
        learning: 0,
        learnt: 0,
        total: 0
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobsRes, statsRes, skillsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/jobs/stats'),
                api.get('/skills'),
            ]);
            setJobs(jobsRes.data);
            setStats(statsRes.data);

            const skills = skillsRes.data;
            setSkillStats({
                learning: skills.filter(s => s.status === 'Learning').length,
                learnt: skills.filter(s => s.status === 'Learnt').length,
                total: skills.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJob = async (formData) => {
        try {
            await api.post('/jobs', formData);
            toast.success('Job application added successfully!');
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add job application');
            console.error('Error adding job:', error);
        }
    };

    const handleUpdateJob = async (formData) => {
        try {
            await api.put(`/jobs/${editingJob._id}`, formData);
            toast.success('Job application updated!');
            setIsModalOpen(false);
            setEditingJob(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job application');
            console.error('Error updating job:', error);
        }
    };

    const handleUpdateJobStatus = async (jobId, newStatus) => {
        const originalJobs = [...jobs];
        setJobs(jobs.map(job => job._id === jobId ? { ...job, status: newStatus } : job));

        try {
            await api.put(`/jobs/${jobId}`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);

            // Refresh stats silently without showing loader
            const [statsRes, skillsRes] = await Promise.all([
                api.get('/jobs/stats'),
                api.get('/skills')
            ]);
            setStats(statsRes.data);
            const skills = skillsRes.data;
            setSkillStats({
                learning: skills.filter(s => s.status === 'Learning').length,
                learnt: skills.filter(s => s.status === 'Learnt').length,
                total: skills.length
            });
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Error updating job status:', error);
            setJobs(originalJobs); // Revert optimistic update
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            try {
                await api.delete(`/jobs/${id}`);
                toast.success('Job application deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete job application');
                console.error('Error deleting job:', error);
            }
        }
    };

    const openAddModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const filteredJobs = jobs.filter(
        (job) =>
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        if (jobs.length === 0) return;

        const headers = ['Company', 'Position', 'Location', 'Status', 'Applied Date', 'Notes'];
        const csvData = jobs.map(job => [
            `"${job.company || ''}"`,
            `"${job.position || ''}"`,
            `"${job.location || ''}"`,
            `"${job.status || ''}"`,
            `"${new Date(job.appliedDate).toLocaleDateString()}"`,
            `"${job.notes ? job.notes.replace(/"/g, '""') : ''}"`
        ]);

        const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `job_applications_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="animate-in slide-in-from-left duration-700">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Here's an overview of your job search progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="btn bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 px-4 py-3 shadow-sm transition-all"
                        title="Export to CSV"
                    >
                        <Download size={20} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-xl shadow-primary-500/20 transition-all hover:-rotate-1 active:rotate-0"
                    >
                        <Plus size={20} className="animate-pulse" />
                        <span className="hidden sm:inline">Add New Job</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 mb-12">
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Total Jobs" count={stats.total} icon={Briefcase} color="slate" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Yet to Apply" count={stats.yetToApply} icon={Briefcase} color="indigo" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Applied" count={stats.applied} icon={Briefcase} color="blue" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Interviews" count={stats.interview} icon={Briefcase} color="orange" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Offers" count={stats.offer} icon={Briefcase} color="green" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Skills Learnt" count={skillStats.learnt} icon={Sparkles} color="purple" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                    <StatsCard label="Learning" count={skillStats.learning} icon={Clock} color="indigo" />
                </div>
            </div>

            {/* Analytics & Upcoming Section */}
            {!loading && jobs.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-150">
                    <div className="lg:col-span-2">
                        <AnalyticsChart stats={stats} />
                    </div>
                    <div className="card bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-primary-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Clock className="text-primary-600" size={20} />
                                Upcoming Interviews
                            </h3>
                            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-2 py-1 rounded-full">
                                {jobs.filter(j => j.status === 'Interview' && new Date(j.interviewDate) >= new Date()).length}
                            </span>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {jobs
                                .filter(j => j.status === 'Interview' && new Date(j.interviewDate) >= new Date())
                                .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
                                .map((job) => (
                                    <div key={job._id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary-200 transition-all group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">{job.company}</h4>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{new Date(job.interviewDate).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">{job.position}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 w-fit px-2 py-0.5 rounded-full">
                                            <Clock size={10} />
                                            {new Date(job.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            {jobs.filter(j => j.status === 'Interview' && new Date(j.interviewDate) >= new Date()).length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                        <Clock size={24} />
                                    </div>
                                    <p className="text-sm text-slate-400">No interviews scheduled soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 backdrop-blur-md">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">Your Applications</h2>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-full flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Grid View"
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`p-1.5 rounded-full flex items-center justify-center transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Board View"
                            >
                                <Kanban size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search companies or roles..."
                            className="input !pl-12 h-10 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
                        <p className="font-medium text-slate-600">Loading your applications...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteJob}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <BoardView jobs={filteredJobs} onEdit={openEditModal} onDelete={handleDeleteJob} onStatusChange={handleUpdateJobStatus} />
                        </div>
                    )
                ) : (
                    <div className="card text-center py-20 bg-slate-50 dark:bg-slate-900/50 border-dashed border-2 dark:border-slate-800">
                        <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {searchTerm ? 'No matches found' : 'No job applications yet'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms to find what you're looking for."
                                : "Your job search dashboard is empty. Start by adding your first application!"}
                        </p>
                        {!searchTerm && (
                            <button onClick={openAddModal} className="btn btn-primary px-6">
                                Add Your First Job
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <JobFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingJob ? handleUpdateJob : handleAddJob}
                editingJob={editingJob}
            />
        </div>
    );
};

export default Dashboard;
