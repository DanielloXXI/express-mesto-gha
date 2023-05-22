const cardSchema = require('../models/card');
const InaccurateDataError = require('../errors/InaccurateDataError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (request, response, next) => {
  cardSchema
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => response.send({ data: cards }))
    .catch(next);
};

const deleteCard = (request, response, next) => {
  const { id: cardId } = request.params;
  const { userId } = request.user;

  cardSchema
    .findById({
      _id: cardId,
    })
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');

      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');

      card
        .remove()
        .then(() => response.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  cardSchema
    .create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

const addLike = (request, response, next) => {
  const { cardId } = request.params;
  const { userId } = request.user;

  cardSchema
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return response.send({ data: card });

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (request, response, next) => {
  const { cardId } = request.params;
  const { userId } = request.user;

  cardSchema
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return response.send({ data: card });

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  deleteLike,
  addLike,
  createCard,
  deleteCard,
  getCards,
};
