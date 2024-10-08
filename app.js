require('dotenv');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerDocs = require('./documentation/v1.0/swagger');

var userRouter = require('./src/user/routes/v1.0/user-routes');
var adminRouter = require('./src/admin/routes/v1.0/admin-routes');
var tasksRouter = require('./src/tasks/routes/v1.0/tasks-routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
swaggerDocs(app, process.env.PORT);

app.use('/api/v1.0/user', userRouter);
app.use('/api/v1.0/admin', adminRouter);
app.use('/api/v1.0/tasks', tasksRouter);

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
  res.send(err + ' error');
});

module.exports = app;
