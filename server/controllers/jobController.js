const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all jobs for logged in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort('-createdAt');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    const { company, position, location, status, notes, appliedDate, interviewDate } = req.body;

    try {
        if (!company || !position) {
            return res.status(400).json({ message: 'Please add company and position' });
        }

        const job = await Job.create({
            user: req.user.id,
            company,
            position,
            location,
            status,
            notes,
            appliedDate: appliedDate ? new Date(appliedDate) : Date.now(),
            ...(status === 'Interview' && interviewDate && { interviewDate: new Date(interviewDate) }),
        });

        // Send email notification if status is Interview
        if (status === 'Interview' && req.user.email) {
            const message = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h1 style="color: #1e293b;">Interview Scheduled! 🚀</h1>
                    <p>Hi ${req.user.name},</p>
                    <p>Exciting news! You've scheduled an interview for the <strong>${position}</strong> position at <strong>${company}</strong>.</p>
                    ${interviewDate ? `<p><strong>Date:</strong> ${new Date(interviewDate).toLocaleDateString()} at ${new Date(interviewDate).toLocaleTimeString()}</p>` : ''}
                    <p>Prepare well and good luck! Use your Smart Job Tracker dashboard to keep track of your notes and preparation.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #64748b;">This is an automated notification from your Smart Job Tracker.</p>
                </div>
            `;

            try {
                await sendEmail({
                    email: req.user.email,
                    subject: `Interview Scheduled: ${company}`,
                    html: message
                });
            } catch (err) {
                console.error('Error sending immediate interview notification:', err);
            }
        }

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the job user
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        // If status changed to Interview, or date changed while in Interview
        const isNowInterview = req.body.status === 'Interview' || (updatedJob.status === 'Interview' && req.body.interviewDate);
        const wasPreviouslyInterview = job.status === 'Interview';

        if (isNowInterview && (!wasPreviouslyInterview || (req.body.interviewDate && req.body.interviewDate !== job.interviewDate?.toISOString()))) {
            const message = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h1 style="color: #1e293b;">Interview Update 🚀</h1>
                    <p>Hi ${req.user.name},</p>
                    <p>The details for your interview for the <strong>${updatedJob.position}</strong> position at <strong>${updatedJob.company}</strong> have been updated.</p>
                    ${updatedJob.interviewDate ? `<p><strong>Date:</strong> ${new Date(updatedJob.interviewDate).toLocaleDateString()} at ${new Date(updatedJob.interviewDate).toLocaleTimeString()}</p>` : ''}
                    <p>Prepare well and good luck!</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #64748b;">This is an automated notification from your Smart Job Tracker.</p>
                </div>
            `;

            try {
                await sendEmail({
                    email: req.user.email,
                    subject: `Interview Update: ${updatedJob.company}`,
                    html: message
                });
            } catch (err) {
                console.error('Error sending interview update notification:', err);
            }
        }

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the job user
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id });

        const stats = {
            total: jobs.length,
            applied: jobs.filter((j) => j.status === 'Applied').length,
            interview: jobs.filter((j) => j.status === 'Interview').length,
            offer: jobs.filter((j) => j.status === 'Offer').length,
            rejected: jobs.filter((j) => j.status === 'Rejected').length,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobStats,
};
