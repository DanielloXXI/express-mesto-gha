const cardRoutes = require('express')
  .Router();
const { cardBodyValidator, cardIdParamsValidator } = require('../utils/requestValidators');

const {
  getCards,
  deleteCard,
  createCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', cardIdParamsValidator, deleteCard);
cardRoutes.post('/', cardBodyValidator, createCard);
cardRoutes.put('/:cardId/likes', cardIdParamsValidator, addLike);
cardRoutes.delete('/:cardId/likes', cardIdParamsValidator, deleteLike);

module.exports = cardRoutes;
