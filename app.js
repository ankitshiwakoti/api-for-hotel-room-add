const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');
const sequelizedB = require('./utils/database');
const User = require('./models/user');
const csrf = require('csurf');
const cors = require('cors');  // Import the CORS package

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const server = express();
server.set('view engine', 'ejs');
server.set('views', 'views');

server.use(bodyParser.urlencoded({extended: false}));
server.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all routes and origins
server.use(cors());

// Routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/apiRoutes');

// create session store in mysql
const sessionStore = new SequelizeStore({
  db: sequelizedB,
  tableName: 'sessions',
});

// setup csrf protection
const csrfProtection = csrf();

// setup server's session store
server.use(
  session({
    secret: 'my_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// setup csrf protection
server.use(csrfProtection);

server.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

server.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

server.use('/admin', adminRoutes);
server.use(authRoutes);
server.use(indexRoutes);
server.use(apiRoutes); 

// connect with database using a default user
sequelizedB
  .sync()
  .then(result => {
    // start the server listening on port 3000
    const port = 3000;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
