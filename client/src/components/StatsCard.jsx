const StatsCard = ({ label, count, icon: Icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 ring-blue-500/20 shadow-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20 dark:shadow-none',
        orange: 'bg-orange-50 text-orange-600 ring-orange-500/20 shadow-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-400/20 dark:shadow-none',
        green: 'bg-green-50 text-green-600 ring-green-500/20 shadow-green-100 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/20 dark:shadow-none',
        red: 'bg-red-50 text-red-600 ring-red-500/20 shadow-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/20 dark:shadow-none',
        slate: 'bg-slate-50 text-slate-600 ring-slate-500/20 shadow-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700/50 dark:shadow-none',
        purple: 'bg-purple-50 text-purple-600 ring-purple-500/20 shadow-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-400/20 dark:shadow-none',
        indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/20 shadow-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-400/20 dark:shadow-none',
    };

    return (
        <div className="card flex items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-xl hover:shadow-primary-500/5 cursor-pointer">
            <div className={`p-3 rounded-2xl ring-1 ring-inset ${colorMap[color]} shadow-lg transition-transform hover:rotate-12`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{count}</h3>
            </div>
        </div>
    );
};

export default StatsCard;
