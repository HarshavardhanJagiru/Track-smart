import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';

const COLORS = {
    Applied: '#3b82f6', // blue
    Interview: '#f97316', // orange
    Offer: '#22c55e', // green
    Rejected: '#ef4444', // red
};

const AnalyticsChart = ({ stats }) => {
    // Convert stats object to array for PieChart
    const data = [
        { name: 'Applied', value: stats.applied },
        { name: 'Interview', value: stats.interview },
        { name: 'Offer', value: stats.offer },
        { name: 'Rejected', value: stats.rejected },
    ].filter((item) => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                Not enough data to generate chart. Add some applications!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 backdrop-blur-md">
            <div className="h-72 w-full">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Application Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'var(--tooltip-bg)',
                                color: 'var(--tooltip-color)'
                            }}
                            itemStyle={{ color: 'inherit' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="h-72 w-full">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Applications Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400 text-xs" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400 text-xs" />
                        <Tooltip
                            cursor={{ fill: 'currentColor', opacity: 0.1 }}
                            className="text-slate-100 dark:text-slate-800"
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'var(--tooltip-bg)',
                                color: 'var(--tooltip-color)'
                            }}
                            itemStyle={{ color: 'inherit' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;
