const router = require('express')
  .Router();
const { createUser, login } = require('../controllers/users');
const { signUpBodyValidator, signInBodyValidator } = require('../utils/requestValidators');
const auth = require('../middlewares/auth');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', signUpBodyValidator, createUser);
router.post('/signin', signInBodyValidator, login);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
