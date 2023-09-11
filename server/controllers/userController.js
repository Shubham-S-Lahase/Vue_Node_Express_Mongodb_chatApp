const User = require('../models/user');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const secret = 'mysecretAkshu';


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.register = [
  upload.single('image'),
  async (req, res) => {
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        image: req.file.path,
      });
      await user.save();
      res.send({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).send(err);
    }
  }
];

exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ message: 'The email does not exist' });
      }
      if (user.password !== req.body.password) { // This is a simplification. In a real app you should hash and salt your passwords
        return res.status(400).send({ message: 'The password is invalid' });
      }
      const payload = { id: user.id };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.send({ message: 'Logged in successfully', token });
    } catch (err) {
      res.status(400).send(err);
    }
  };
