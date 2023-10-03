const express = require('express');
const router = express.Router();
const chatGroupController = require('../controllers/chatgroupController');

router.post('/createChatGroup', chatGroupController.createChatGroup);
router.post('/addFriendToChatGroup', chatGroupController.addFriendToChatGroup);
router.post('/leaveChatGroup', chatGroupController.leaveChatGroup);
router.post('/deleteChatGroup', chatGroupController.deleteChatGroup);
router.post('/startPrivateChat', chatGroupController.startPrivateChat);
router.post('/newMessage', chatGroupController.newMessage);


module.exports = router;