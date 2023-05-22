const usersRouter = require('express').Router();
const { userIdParamsValidator, userMeBodyValidator, avatarBodyValidator } = require('../utils/requestValidators');

const {
  getAllUsers, getUserById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getMe);
usersRouter.get('/:userId', userIdParamsValidator, getUserById);
usersRouter.patch('/me', userMeBodyValidator, updateUser);
usersRouter.patch('/me/avatar', avatarBodyValidator, updateAvatar);
module.exports = usersRouter;
