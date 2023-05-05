const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send(err));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send(err));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send(err));
};

const updateUser = (request, response) => {
  const { name, about } = request.body;

  User
    .findByIdAndUpdate(
      request.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => response.status(200).send(user))
    .catch((err) => response.status(500).send(err));
};

const updateAvatar = (request, response) => {
  const { avatar } = request.body;

  User
    .findByIdAndUpdate(
      request.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => response.status(200).send(user))
    .catch((err) => response.status(500).send(err));
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateUser,
};
