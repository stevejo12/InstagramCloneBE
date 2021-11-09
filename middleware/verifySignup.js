import userSchema from '../schema/user.js';

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  userSchema.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (user) {
      res.status(400).send({ message: "Username has already been used!" });
      return;
    }

    // Email
    userSchema.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
      }

      if (user) {
        res.status(400).send({ message: "Email has already been used!" });
        return;
      }

      next();
    })
  })
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

export default verifySignUp;