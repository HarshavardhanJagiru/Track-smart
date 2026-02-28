const cron = require('node-cron');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

// Schedule tasks to be run on the server.
// Runs every day at 08:00 AM
cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running Interview Reminder Cron Job...');
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch jobs with interviews scheduled for tomorrow
        const upcomingInterviews = await Job.find({
            status: 'Interview',
            interviewDate: {
                $gte: tomorrow,
                $lt: dayAfterTomorrow
            }
        }).populate('user', 'name email');

        if (upcomingInterviews.length === 0) {
            console.log('No interviews scheduled for tomorrow.');
            return;
        }

        console.log(`Found ${upcomingInterviews.length} interviews for tomorrow.`);

        for (const job of upcomingInterviews) {
            if (job.user && job.user.email) {
                const message = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h1 style="color: #1e293b;">Interview Reminder 🗓️</h1>
                        <p>Hi ${job.user.name},</p>
                        <p>This is a friendly reminder that you have an upcoming interview for the <strong>${job.position}</strong> position at <strong>${job.company}</strong> tomorrow!</p>
                        <p><strong>Time:</strong> ${new Date(job.interviewDate).toLocaleTimeString()}</p>
                        <p>Take some time today to review your notes and research the company. You've got this!</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #64748b;">This is an automated reminder from your Smart Job Tracker.</p>
                    </div>
                `;

                try {
                    await sendEmail({
                        email: job.user.email,
                        subject: `Reminder: Interview tomorrow at ${job.company}`,
                        html: message
                    });
                    console.log(`✅ Reminder sent to ${job.user.email} for ${job.company}`);
                } catch (err) {
                    console.error(`❌ Error sending reminder to ${job.user.email}:`, err);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error in cron job:', error);
    }
});

module.exports = cron;
