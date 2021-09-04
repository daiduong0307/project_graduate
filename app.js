var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
const exphbs = require('express-handlebars');
const hbs = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require('./db/mongoose')
var methodOverride = require("method-override");

//authorization
// const loginMiddleware = require('./middleware/loginMiddleware')
// const authRoute = require('./routes/auth')

//Route
const adminRoute = require('./routes/adminRoute')
const staffRoute = require('./routes/staffRoute')
const managerRoute = require('./routes/managerRoute')
const loginRoute = require('./routes/loginRoute')

//Middleware
const loginMiddleware = require('./middleware/loginMiddleware')



var app = express();

// using Session to verify User Login.
app.use(
  session({
    secret: "mySecretSession",
    resave: true,
    saveUninitialized: false,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', exphbs({
    defaultLayout: 'adminLayout',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    handlebars: allowInsecurePrototypeAccess(hbs),
    extname: '.hbs'
}));
app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//============
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);


app.use('/', loginRoute)
app.use('/admin',  adminRoute)
app.use('/staff', loginMiddleware.isStaff, staffRoute)
app.use('/manager', loginMiddleware.isManager, managerRoute)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
