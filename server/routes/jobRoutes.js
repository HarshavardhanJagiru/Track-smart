const express = require('express');
const router = express.Router();
const {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobStats,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All job routes are protected

router.route('/').get(getJobs).post(createJob);
router.route('/stats').get(getJobStats);
router.route('/:id').put(updateJob).delete(deleteJob);

module.exports = router;
