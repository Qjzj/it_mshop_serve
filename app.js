const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models/db');
const session = require('express-session');
const utils = require('./utils/utils');
const MongoStore = require('connect-mongo')(session);
const permission = require('./middle_ware/permission');
const ErrorLog = require('./middle_ware/errorLogs')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const resourceRouter = require('./routes/resources');
const reptileRouter = require('./routes/reptile');
const uploadRouter = require('./routes/upload');
const goodsRouter = require('./routes/goods');
const cartRouter = require('./routes/cart');
const bannerRouter = require('./routes/banner')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: utils.getRandomCode(6, 'mixed'),
  name: 'KittyId',
  cookie: {
    maxAge: 0.5 * 60 * 60 * 1000,
  },
  saveUninitialized: false,
  resave: false,
  rolling: true,
  store: new MongoStore({mongooseConnection: db})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use(permission);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/resource', resourceRouter);
app.use('/reptile', reptileRouter);
app.use('/upload', uploadRouter);
app.use('/goods', goodsRouter);
app.use('/cart', cartRouter);
app.use('/banner', bannerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(ErrorLog);
module.exports = app;
