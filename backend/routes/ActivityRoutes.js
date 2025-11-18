const express = require('express');
const router = express.Router();
const { 
    createActivity, 
    getActivities, 
    updateActivity, 
    deleteActivity, 
    markAttendance, 
    getActivityAttendance 
} = require('../controllers/ActivityController');
const Auth = require('../utills/Auth');

router.post('/createActivity', Auth, createActivity);
router.post('/getActivities', Auth, getActivities);
router.post('/updateActivity', Auth, updateActivity);
router.post('/deleteActivity', Auth, deleteActivity);
router.post('/markAttendance', Auth, markAttendance);
router.post('/getActivityAttendance', Auth, getActivityAttendance);

module.exports = router;