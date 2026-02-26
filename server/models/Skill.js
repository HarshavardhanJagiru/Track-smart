const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a skill name'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Learning', 'Learnt', 'Need to Learn'],
            default: 'Need to Learn',
        },
        proficiency: {
            type: Number, // 0 to 100
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Skill', SkillSchema);
