const User = require('../models/user');
const multer = require('multer');

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
