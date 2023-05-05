const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const user = require('./models/user');
// const card = require('./models/card');
const router = require('./routes/router');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6454da203ccb77f4c70deb3a', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/', router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});

app.listen(PORT, () => {
});
