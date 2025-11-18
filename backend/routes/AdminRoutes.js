const app = require('express');
const router = app.Router();
const { 
    registerAdmin, 
    loginAdmin, 
    getAdmins,
    updateAdminRole,
    deleteAdmin
} = require('../controllers/AdminController');
const bodyParser = require('body-parser');
const Auth = require('../utills/Auth');

router.use(bodyParser.urlencoded({ extended: false }))
router.post('/registerAdmin', registerAdmin);
router.post('/loginAdmin', loginAdmin);
router.post('/getAdmins', Auth, getAdmins);
router.post('/updateAdminRole', Auth, updateAdminRole);
router.post('/deleteAdmin', Auth, deleteAdmin);

module.exports = router;