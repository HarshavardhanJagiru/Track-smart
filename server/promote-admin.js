const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from current directory .env
dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    isAdmin: Boolean
});

const User = mongoose.model('User', UserSchema);

async function promoteToAdmin(email) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { isAdmin: true },
            { new: true }
        );

        if (user) {
            console.log(`Successfully promoted ${email} to Admin!`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email address: node promote-admin.js user@example.com');
    process.exit(1);
}

promoteToAdmin(email);
