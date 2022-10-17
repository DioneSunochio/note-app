const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// @desc   Register user
// @route  POST /auth/register
// @access Public
const registerController = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields.");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409);
      throw new Error("User already exists.");
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashPwd });

    const token = generatedToken(newUser.id);

    if (newUser) {
      res.cookie("access_token", token, { httpOnly: true }).status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid data.");
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  GET /auth/login
// @access Public
const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields.");
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      res.status(404);
      throw new Error("Wrong email or password.");
    }

    const isCorrectPwd = await bcrypt.compare(password, userExists.password);

    if (!isCorrectPwd) {
      res.status(400);
      throw new Error("Wrong email or password.");
    }

    const user = await User.findOne({ _id: userExists.id }).select("-password");

    const token = generatedToken(user.id);

    if (user) {
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid data.");
    }
  } catch (error) {
    next(error);
  }
};

const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

module.exports = { registerController, loginController };
