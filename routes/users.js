const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getMe);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);
module.exports = usersRouter;
