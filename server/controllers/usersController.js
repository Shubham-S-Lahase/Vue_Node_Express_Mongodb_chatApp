const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "ShubhsEffect";
const nodemailer = require("nodemailer");
const emailUsername = "shubhamlahase@gmail.com";
const emailPassword = "Shubham@007";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require("crypto");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUsername,
    pass: emailPassword,
  },
});

(exports.register = upload.single("profilePhoto")),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashedPassword,
        profilePhoto: req.file.path,
      });
      await user.save();

      const token = jwt.sign({ userId: user._id }, jwtSecretKey);

      const emailToken = jwt.sign(
        { userId: user._id },
        process.env.EMAIL_SECRET,
        { expiresIn: "1d" }
      );
      let url = `http://localhost:3000/confirmation/${emailToken}`;
      await transporter.sendMail({
        to: user.email,
        subject: "Confirm Email",
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
      });

      res.status(201).json({ success: true, token, userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false,  message: "Server error" });
    }
  };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send an email to the user with the reset token
    let url = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
      totalFriendRequests: user.friendRequests.length,
      totalFriends: user.friends.length,
      friends: user.friends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

(exports.updateUserProfile = upload.single("profilePhoto")),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, password } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (req.file) {
        user.profilePhoto = req.file.path;
      }
      await user.save();

      res.status(200).json({
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    user.friendRequests.push(friendId);
    await user.save();
    res.status(200).json({ message: "Friend request sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    user.friends.push(friendId);
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    await user.save();
    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    user.rejectedRequests.push(friendId);
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    await user.save();
    res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
