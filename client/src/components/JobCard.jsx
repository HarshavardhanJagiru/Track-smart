import { Edit2, Trash2, MapPin, Calendar } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, compact = false }) => {
    const statusStyles = {
        'Yet to Apply': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
        Applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        Interview: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        Offer: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        Rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className={`card group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md ${compact ? 'p-4' : ''}`}>
            <div className={`flex justify-between items-start ${compact ? 'mb-3' : 'mb-6'}`}>
                <div className="space-y-1">
                    <h3 className={`${compact ? 'text-lg text-slate-800 dark:text-white' : 'text-xl text-slate-900 dark:text-white'} font-black group-hover:text-primary-600 transition-colors tracking-tight line-clamp-1`}>
                        {job.position}
                    </h3>
                    <p className={`text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider ${compact ? 'text-[9px]' : 'text-[10px]'} line-clamp-1`}>{job.company}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black border-2 uppercase tracking-widest ${statusStyles[job.status] || statusStyles.Applied
                        }`}
                >
                    {job.status}
                </span>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
                        <MapPin size={14} />
                    </div>
                    {job.location}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
                        <Calendar size={14} />
                    </div>
                    {formatDate(job.appliedDate)}
                </div>

                {job.status === 'Interview' && job.interviewDate && (
                    <div className="flex items-center gap-3 text-sm font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400">
                            <Calendar size={14} />
                        </div>
                        Interview: {formatDate(job.interviewDate)}
                    </div>
                )}

                {job.status === 'Yet to Apply' && job.deadline && (
                    <div className="flex items-center gap-3 text-sm font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Calendar size={14} />
                        </div>
                        Deadline: {formatDate(job.deadline)}
                    </div>
                )}
            </div>

            {job.notes && !compact && (
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                        "{job.notes}"
                    </p>
                </div>
            )}

            <div className={`flex justify-end gap-2 ${compact ? 'pt-3' : 'pt-4'} border-t border-slate-100/50`}>
                <button
                    onClick={() => onEdit(job)}
                    className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    title="Edit Job"
                >
                    <Edit2 size={18} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => onDelete(job._id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Job"
                >
                    <Trash2 size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default JobCard;
