const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Bad Request' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404)
          .send({ message: 'User with _id cannot be found' });
      }

      return res.status(500)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Invalid data to create user' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    });
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
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return response.status(400)
          .send({ message: 'Invalid data to update user' });
      }

      return response.status(500)
        .send({ message: err.message });
    });
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
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        response.status(400)
          .send({ message: 'Invalid data to update avatar' });
      } else {
        response.status(500)
          .send({ message: err.message });
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateUser,
};
