if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // For storing session data
const ejsMate = require('ejs-mate'); // For ejs-layouts
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize'); // For restricting users to put any malicious queries

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------------------- Local Imports --------------------------- */
const projectRouter = require('./routes/projects.router');
const issueRouter = require('./routes/issues.router');
const userRouter = require('./routes/users.router');
const User = require('./models/user.model');
const ExpressError = require('./utils/ExpressError.util');

/* ---------------------- Database -------------------------------- */

// For connecting to MongoDB Atlas :
// const dbUrl = 'mongodb://127.0.0.1:27017/issue-tracker';
const dbUrl =
  process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/issue-tracker';
mongoose
  .connect(dbUrl)
  .then((res) => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error connecting MongoDB', err));

/* ---------------------- View Engine ----------------------------- */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------------------- Middlewares ----------------------------- */
// express :
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
// session :
const secret = process.env.SECRET || 'thisisasecret';
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // In seconds
  crypto: {
    secret,
  },
});
store.on('error', (e) => {
  console.log('SESSION STORE ERROR', e);
});
const sessionConfig = {
  store,
  name: 'session', // Changing the default name
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Default now
    // secure: true,	// Works only with 'https'.
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// passport :
app.use(passport.initialize());
app.use(passport.session()); // need to use after express.session()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongo sanitize :
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
); // For restricting users to put any malicious queries

// Setting locals :
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/* ------------------------ Routers ------------------------------ */

app.use('/', projectRouter);
app.use('/users', userRouter);
app.use('/:id/issues', issueRouter);

// 404 Not Found :
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => console.log(`Server running at : ${PORT}`));
