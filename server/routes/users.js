const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);
router.get('/profile/:userId', usersController.getUserProfile);
router.put('/profile/:userId', usersController.updateUserProfile);
router.post('/friend-request/:userId', usersController.sendFriendRequest);
router.post('/accept-request/:userId', usersController.acceptFriendRequest);
router.post('/reject-request/:userId', usersController.rejectFriendRequest);
router.get('/friends/:userId', usersController.getFriendsList)

module.exports = router;