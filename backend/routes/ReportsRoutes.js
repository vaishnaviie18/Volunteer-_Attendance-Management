const app = require('express');
const router = app.Router();
const { 
    getTopPerformers, 
    getVolunteerStatistics, 
    getDepartmentWiseReport, 
    getCampEligibilityList 
} = require('../controllers/ReportsController');
const bodyParser = require('body-parser');
const Auth = require('../utills/Auth');

router.use(bodyParser.urlencoded({ extended: false }))
router.post('/getTopPerformers', Auth, getTopPerformers);
router.post('/getVolunteerStatistics', Auth, getVolunteerStatistics);
router.post('/getDepartmentWiseReport', Auth, getDepartmentWiseReport);
router.post('/getCampEligibilityList', Auth, getCampEligibilityList);

module.exports = router;