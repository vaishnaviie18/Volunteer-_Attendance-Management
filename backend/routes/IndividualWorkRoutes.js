const app = require('express');
const router = app.Router();
const { 
    addIndividualWork, 
    getVolunteerWork, 
    getAllWork, 
    updateWork, 
    deleteWork 
} = require('../controllers/IndividualWorkController');
const bodyParser = require('body-parser');
const Auth = require('../utills/Auth');

router.use(bodyParser.urlencoded({ extended: false }))
router.post('/addIndividualWork', Auth, addIndividualWork);
router.post('/getVolunteerWork', Auth, getVolunteerWork);
router.post('/getAllWork', Auth, getAllWork);
router.post('/updateWork', Auth, updateWork);
router.post('/deleteWork', Auth, deleteWork);

module.exports = router;