import React, { useState } from 'react';
import JobCard from './JobCard';

const BOARD_COLUMNS = [
    { id: 'Applied', title: 'Applied', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
    { id: 'Interview', title: 'Interviewing', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
    { id: 'Offer', title: 'Offers', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
    { id: 'Rejected', title: 'Rejected', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
];

const BoardView = ({ jobs, onEdit, onDelete, onStatusChange }) => {
    const [activeColumn, setActiveColumn] = useState(null);

    const handleDragStart = (e, jobId) => {
        e.dataTransfer.setData('jobId', jobId);
        setTimeout(() => {
            e.target.style.opacity = '0.4';
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setActiveColumn(null);
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        if (activeColumn !== columnId) setActiveColumn(columnId);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setActiveColumn(null);
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        setActiveColumn(null);
        const jobId = e.dataTransfer.getData('jobId');
        if (jobId && onStatusChange) {
            onStatusChange(jobId, columnId);
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px] snap-x">
            {BOARD_COLUMNS.map((column) => {
                const columnJobs = jobs.filter((job) => job.status === column.id);
                const isActive = activeColumn === column.id;

                return (
                    <div
                        key={column.id}
                        className={`flex-shrink-0 w-80 rounded-2xl border flex flex-col snap-center transition-all duration-300 ${column.bgColor} ${isActive ? 'ring-2 ring-primary-500 scale-[1.02] shadow-lg ' + column.borderColor : column.borderColor}`}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className="p-4 border-b border-inherit bg-white/50 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className={`font-bold ${column.textColor}`}>
                                    {column.title}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${column.bgColor} ${column.textColor}`}>
                                    {columnJobs.length}
                                </span>
                            </div>
                        </div>

                        <div className={`p-4 flex-1 overflow-y-auto space-y-4 rounded-b-2xl transition-colors ${isActive ? 'bg-white/40' : ''}`}>
                            {columnJobs.length > 0 ? (
                                columnJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, job._id)}
                                        onDragEnd={handleDragEnd}
                                        className="transition-transform hover:-translate-y-1 cursor-grab active:cursor-grabbing"
                                    >
                                        <JobCard job={job} onEdit={onEdit} onDelete={onDelete} compact={true} />
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-inherit rounded-xl opacity-60">
                                    <p className="text-sm font-medium">No jobs in {column.title.toLowerCase()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BoardView;
