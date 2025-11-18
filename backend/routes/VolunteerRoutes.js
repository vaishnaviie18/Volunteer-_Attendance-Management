const app = require('express');
const router = app.Router();
const { 
    registerVolunteer, 
    loginVolunteer, 
    getVolunteerActivities, 
    getMyAttendance, 
    getMyWork, 
    getMyStatistics, 
    changePassword,
    forgotPassword,
    resetPassword,
    bulkRegisterVolunteers
} = require('../controllers/VolunteerController');
const bodyParser = require('body-parser');
const Auth = require('../utills/Auth');

router.use(bodyParser.urlencoded({ extended: false }))
router.post('/registerVolunteer', registerVolunteer);
router.post('/bulkRegisterVolunteers', bulkRegisterVolunteers);
router.post('/loginVolunteer', loginVolunteer);
router.post('/getVolunteerActivities', getVolunteerActivities);
router.post('/getMyAttendance', Auth, getMyAttendance);
router.post('/getMyWork', Auth, getMyWork);
router.post('/getMyStatistics', Auth, getMyStatistics);
router.post('/changePassword', Auth, changePassword);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;