const cardSchema = require('../models/card');
const InaccurateDataError = require('../errors/InaccurateDataError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (request, response, next) => {
  cardSchema
    .find({})
    .then((cards) => response.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema.findById(cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Нет карточки с таким id'); }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }
      return card.deleteOne()
        .then((cardData) => {
          res.send({ data: cardData });
        });
    })
    .catch(next);
};

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

const addLike = (request, response, next) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      {
        $addToSet: {
          likes: request.user._id,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return response.send(card);

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (request, response, next) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      {
        $pull: {
          likes: request.user._id,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return response.send(card);

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
