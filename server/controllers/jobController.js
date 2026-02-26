const Job = require('../models/Job');

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
