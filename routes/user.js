import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../schema/user.js'
import verifySignUp from '../middleware/verifySignUp.js'

const router = express.Router();

// verifysignup => middleware for verification of data integrity
// such as duplicate email or duplicate username check before registration
router.post('/register', verifySignUp.checkDuplicateUsernameOrEmail, (req, res) => {
  const reqData = new userSchema({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: "https://i.stack.imgur.com/34AD2.jpg" // default for now
  })

  userSchema.create(reqData, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).json({
        message: "User successfully created"
      })
    }
  })
})
router.post("/login", (req, res) => {
  userSchema.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
      return;
    } 

    if (!user) {
      return res.status(404).send({
        token: null,
        message: "User not Found"
      });
    }

    var isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).send({
        token: null,
        message: "Invalid Password"
      });
    }

    var token = jwt.sign(
      {
        user_id: user._id,
        email: user.email
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      user,
      token,
      message: "Login Successful"
    })
  })
})

export default router;