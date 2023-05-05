const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);
module.exports = usersRouter;
