var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');
var app = express();

const session = require('express-session');
// Set up session
app.use(session({
    secret: 'c6a8b37ed28dd15ef59ac24ba0a29c3b16583e74331cf33f2bee071a2744ca771db9349aa8141aaf107acffc481bdea089b2ab1d8da4cd4d8ea43d17bfba2e33',
    resave: false,
    saveUninitialized: true
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public')); //image upload here//



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', indexRouter);
app.use('/action', indexRouter);
app.use(bodyParser());
app.use('/userlog', indexRouter);
app.use('/userhome', indexRouter);
app.use('/adminregister', indexRouter);
app.use('/product', indexRouter);
app.use('/edit', indexRouter);
app.use('/userproduct', indexRouter);
app.use('/userbuy', indexRouter);
app.use('/userbuyview', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
