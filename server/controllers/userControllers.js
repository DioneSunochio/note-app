const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Note = require("../models/noteModel");

// @desc   Update user
// @route  PATCH /users/update
// @access Private
const updateController = async (req, res, next) => {
  const { username } = req.body;
  try {
    if (!username) {
      res.status(400);
      throw new Error("Please add username.");
    }

    const userUpdate = await User.findByIdAndUpdate(
      req.user,
      {
        username: username,
      },
      { new: true }
    );

    if (userUpdate) {
      res
        .status(200)
        .json({ username: userUpdate.username, email: userUpdate.email });
    } else {
      res.status(400);
      throw new Error("Invalid data.");
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Delete user
// @route  DELETE /users/delete
// @access Private
const deleteController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields.");
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      res.status(400);
      throw new Error("Wrong email or password.");
    }

    const isCorrectPwd = await bcrypt.compare(password, userExists.password);

    if (!isCorrectPwd) {
      res.status(400);
      throw new Error("Wrong email or password.");
    }

    if (req.user !== userExists.id) {
      res.status(400);
      throw new Error("Invalid credentials.");
    }

    await User.findByIdAndDelete(req.user);

    await Note.deleteMany({ userId: req.user });

    res
      .cookie("access_token", "", { httpOnly: true })
      .status(200)
      .json({ message: `User with id ${req.user} was deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateController, deleteController };
