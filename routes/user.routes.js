const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require("../controllers/userController");

//auth
router.post('/register', authController.signUp);
router.post('/login',authController.signIn)
router.get('/logout',authController.logout)

//user display: 'block'
router.get('/',userController.getAllUsers)
router.get('/:id',userController.userInfo)
router.put("/:id",userController.updateUser)

module.exports = router ;