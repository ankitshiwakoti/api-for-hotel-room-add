const User = require("../models/user");
const bcrypt = require("bcrypt");

class AuthController {
  
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.getLogin = this.getLogin.bind(this);
    this.getSignup = this.getSignup.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.postSignup = this.postSignup.bind(this);
    this.postLogout = this.postLogout.bind(this);
  }

  getLogin(req, res, next) {
    res.render("index", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: this.isAuthenticated,
    });
  }

  // Method to render the signup page
  getSignup(req, res, next) {
    res.render("signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: this.isAuthenticated,
    });
  }

  // Method to handle the login process
  postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return res.redirect("/login");
        }
        bcrypt.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            this.isAuthenticated = true;
            this.user = user;
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/admin/products");
            });
          }
          res.redirect("/login");
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  }

  // Method to handle the signup process
  postSignup(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return res.redirect("/signup");
    }

    User.findOne({ where: { email: email } })
      .then((userDoc) => {
        if (userDoc) {
          console.log("User already exists");
          return res.redirect("/signup");
        }
        return bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });
          console.log(user);
          return user.save();
        });
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Method to handle user logout
  postLogout(req, res, next) {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  }
}

// Export the instance of AuthController
module.exports = new AuthController();
