const cardSchema = require('../models/card');

const getCards = (request, response) => {
  cardSchema
    .find({})
    .then((cards) => response.status(200).send(cards))
    .catch((err) => response.status(500).send({ message: err.message }));
};

const deleteCard = (request, response) => {
  const { cardId } = request.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return response.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => response.status(500).send(err));
};

const createCard = (request, response) => {
  const { name, link } = request.body;
  const owner = request.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => response.status(201).send(card))
    .catch((err) => response.status(500).send(err));
};

const addLike = (request, response) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $addToSet: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return response.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => response.status(500).send(err));
};

const deleteLike = (request, response) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $pull: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return response.status(404)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => response.status(500).send(err));
};

module.exports = {
  deleteLike,
  addLike,
  createCard,
  deleteCard,
  getCards,
};
