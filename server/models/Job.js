const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        company: {
            type: String,
            required: [true, 'Please provide a company name'],
            trim: true,
        },
        position: {
            type: String,
            required: [true, 'Please provide a position title'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
            default: 'Applied',
        },
        location: {
            type: String,
            trim: true,
            default: '',
        },
        notes: {
            type: String,
            trim: true,
            default: '',
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        interviewDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
