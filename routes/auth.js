const express = require('express')
const router = express.Router();

const {registerUser, loginUser, logout, forgotPassword, getUserProfile, updatePassword, 
    updateProfile, allUsers, getUserDetails, updateUser, deleteUser, resetPassword} = require('../controller/authController')
const {isAuthenticated, authorizedRoles} = require ('../middlewares/auth')
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticated, getUserProfile)
router.route('/password/update').put(isAuthenticated, updatePassword)
router.route('/me/update').put(isAuthenticated, updateProfile)
router.route('/admin/users').get(isAuthenticated, authorizedRoles('admin'), allUsers)
router.route('/admin/user/:id').get(isAuthenticated, authorizedRoles('admin'), getUserDetails)
.put(isAuthenticated, authorizedRoles('admin'), updateUser)
.delete(isAuthenticated, authorizedRoles('admin'), deleteUser)



module.exports = router;