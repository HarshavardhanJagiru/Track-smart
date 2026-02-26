const Skill = require('../models/Skill');

// @desc    Get all skills for a user
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id }).sort('-createdAt');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private
const addSkill = async (req, res) => {
    const { name, status, proficiency, notes } = req.body;

    try {
        const newSkill = new Skill({
            name,
            status,
            proficiency,
            notes,
            user: req.user.id,
        });

        const skill = await newSkill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user owns the skill
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user owns the skill
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,
};
