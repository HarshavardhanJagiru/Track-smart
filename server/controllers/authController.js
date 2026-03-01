const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Job = require('../models/Job');
const Skill = require('../models/Skill');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // Generate verification token
            const verificationToken = user.getVerificationToken();
            await user.save({ validateBeforeSave: false });

            // Create verification URL - we append the 'origin' from the request
            // so the backend knows which port to redirect back to later!
            const frontendOrigin = req.get('origin') || process.env.CLIENT_URL || 'http://localhost:5173';
            const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}?redirect=${encodeURIComponent(frontendOrigin)}`;

            // In a real app we'd link to frontend. For now, we'll configure frontend to hit this or we just provide the API link
            const message = `
                <h1>Welcome to SmartJob Tracker</h1>
                <p>Please verifying your email by clicking the link below:</p>
                <a href="${verifyUrl}" clicktracking="off">${verifyUrl}</a>
            `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Verify your SmartJob Tracker account',
                    html: message
                });

                res.status(201).json({
                    success: true,
                    message: 'Registration successful! Verification email sent.'
                });
            } catch (err) {
                console.error('Email sending error:', err);
                user.verificationToken = undefined;
                user.verificationTokenExpire = undefined;
                await user.save({ validateBeforeSave: false });

                return res.status(500).json({ message: 'Email could not be sent' });
            }

        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Verify user email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        // Get hashed token
        const verificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set verified to true
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save();

        // Redirect to login on frontend
        // We use the 'redirect' query param we passed in the email link, else fallback to .env
        const frontendUrl = req.query.redirect || process.env.CLIENT_URL || 'http://localhost:5173';
        const redirectUrl = `${frontendUrl}/login?verified=true`;
        console.log(`✅ Email verified for ${user.email}. Redirecting to: ${redirectUrl}`);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {

            // Check if user is verified
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email address to log in.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get all users
// @route   GET /api/auth
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if requester is admin OR deleting themselves
        if (!req.user.isAdmin && req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this user' });
        }

        // Cascading deletion of associated data
        await Job.deleteMany({ user: user._id });
        await Skill.deleteMany({ user: user._id });

        // Final user deletion
        await User.findByIdAndDelete(user._id);

        res.json({ message: 'User and associated data removed successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error during user deletion' });
    }
};

// @desc    Promote user to admin
// @route   PUT /api/auth/:id/role
// @access  Private/Admin
const promoteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only admins can promote others
        if (!req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to promote users' });
        }

        user.isAdmin = true;
        await user.save();

        res.json({ message: 'User promoted to Administrator successfully', user });
    } catch (error) {
        console.error('Promote user error:', error);
        res.status(500).json({ message: 'Server error during user promotion' });
    }
};

// Export all functions
module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    getUsers,
    deleteUser,
    promoteUser,
};