const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = "" //addmongo dburl;

const app = express();

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const store= new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
})
const csrfProtection = csrf();
//********************************************* */
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });


const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
)
// multer({ storage: fileStorage })

app.use(multer({ storage: fileStorage }).single('image'))
// console.log("Hello");
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));//parser for img

app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));



  app.use(csrfProtection);
  app.use(flash());
  
  
  app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    // console.log("helllo");

    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
  });
  
app.use((req, res, next) => {
  //locals variable that are used in views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  console.log(req.session);
  
  console.log("************************************");
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    csrfToken: req.session.csrfSecret
  });
});


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000,()=>{
      console.log("app listeing...");
    });
  })
  .catch(err => {
    console.log(err);
  });
