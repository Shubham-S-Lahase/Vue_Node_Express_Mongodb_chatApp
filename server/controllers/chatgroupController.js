const User = require("../models/User");
const ChatGroup = require("../models/ChatGroup");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.createChatGroup = async (req, res) => {
  try {
    const { userId, name, friends } = req.body;

    const chatGroup = new ChatGroup({
      name,
      creator: userId,
      members: [userId, ...friends],
    });

    await chatGroup.save();

    res.status(200).json({ message: "Chat group created." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFriendToChatGroup = async (req, res) => {
  try {
    const { groupId, friendId } = req.body;

    const user = await User.findById(userId);
    const chatGroup = await ChatGroup.findById(groupId);

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "This user is not your friend." });
    }

    if (!chatGroup.members.includes(friendId)) {
      chatGroup.members.push(friendId);
      await chatGroup.save();

      res.status(200).json({ message: "Friend added to chat group." });
    } else {
      res
        .status(400)
        .json({ message: "This user is already a member of the chat group." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteChatGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const chatGroup = await ChatGroup.findById(groupId);

    if (chatGroup.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator of the group can delete it." });
    }

    await ChatGroup.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Chat group deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.startPrivateChat = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Check if a private chat already exists between these two users
    let chatGroup = await ChatGroup.findOne({
      members: { $all: [userId, friendId] },
      isPrivate: true,
    });

    if (!chatGroup) {
      // If not, create a new private chat
      chatGroup = new ChatGroup({
        name: `${userId}-${friendId}`,
        creator: userId,
        members: [userId, friendId],
        isPrivate: true,
      });
      await chatGroup.save();
    }

    res
      .status(200)
      .json({ message: "Private chat started.", chatGroupId: chatGroup._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

(exports.newMessage = upload.single("file")),
  async (req, res) => {
    try {
      const { groupId, senderId, content } = req.body;

      const chatGroup = await ChatGroup.findById(groupId);

      const newMessage = {
        sender: senderId,
        content,
        file: req.file ? req.file.path : null, // Save the file path if a file was uploaded
      };

      chatGroup.messages.push(newMessage);

      await chatGroup.save();

      res.status(200).json({ message: "Message sent." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
