import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const JobFormModal = ({ isOpen, onClose, onSubmit, editingJob = null }) => {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: 'Remote',
        status: 'Applied',
        notes: '',
        appliedDate: new Date().toISOString().split('T')[0],
        interviewDate: '',
    });

    useEffect(() => {
        if (editingJob) {
            setFormData({
                company: editingJob.company,
                position: editingJob.position,
                location: editingJob.location || 'Remote',
                status: editingJob.status,
                notes: editingJob.notes || '',
                appliedDate: editingJob.appliedDate
                    ? new Date(editingJob.appliedDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                interviewDate: editingJob.interviewDate
                    ? new Date(editingJob.interviewDate).toISOString().split('T')[0]
                    : '',
            });
        } else {
            setFormData({
                company: '',
                position: '',
                location: 'Remote',
                status: 'Applied',
                notes: '',
                appliedDate: new Date().toISOString().split('T')[0],
                interviewDate: '',
            });
        }
    }, [editingJob, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {editingJob ? 'Edit Job Application' : 'Add New Job'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Company</label>
                            <input
                                type="text"
                                name="company"
                                required
                                className="input"
                                placeholder="Google, Meta, etc."
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Position</label>
                            <input
                                type="text"
                                name="position"
                                required
                                className="input"
                                placeholder="Frontend Developer"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="input"
                                placeholder="Remote, NYC, etc."
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <select
                                name="status"
                                className="input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Applied Date</label>
                            <input
                                type="date"
                                name="appliedDate"
                                required
                                className="input w-full"
                                value={formData.appliedDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Notes (Optional)</label>
                            <textarea
                                name="notes"
                                rows="3"
                                className="input resize-none w-full"
                                placeholder="Added via referral, next follow-up on Friday..."
                                value={formData.notes}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {formData.status === 'Interview' && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-semibold text-slate-700">Interview Date</label>
                            <input
                                type="date"
                                name="interviewDate"
                                required
                                className="input w-full border-orange-200 focus:ring-orange-500/20 focus:border-orange-500"
                                value={formData.interviewDate}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary px-6"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-8">
                            {editingJob ? 'Update Job' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFormModal;
