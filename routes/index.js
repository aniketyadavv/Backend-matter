var express = require('express');
var router = express.Router();
const userModel = require("./users");
const { model } = require('mongoose');

const passport = require('passport');
const localStartegy = require('passport-local');
passport.use(new localStartegy(userModel.authenticate()));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', function (req, res) {
  res.render('profile');
})

router.post('/register', function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    })
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

/* 
router.get('/failed', function (req, res) {
  req.flash("age", 12);
  res.send("ban gaya")
});

router.get('/check', function (req, res) {
  console.log(req.flash("age"));
  res.send("check karo")
});

router.get("/create", async function (req, res) {
  const createdUser = await userModel.create({
    "username": "Rahul",
    "nickname": "rah",
    "description": "Tech enthusiast 🚀",
    "categories": ["Python", "Django", "Backend"]
  }
  );
  res.send(createdUser)
})

// router.get('/find', async function (res, req) {
//   const data = await userModel.find({});
//   req.send(data);
// })

// Question 1: How can i perform a case sensitive search in mongoose🔍
// We have to use regex:-

router.get('/findone', async function (req, res) {
  const regex = new RegExp("^anIket$", "i");
  let user = await userModel.find({ username: regex });
  res.send(user);
})

// Question 2: How can i find in categories section of a user🔍
router.get('/find', async function (req, res) {
  let allusers = await userModel.find({ categories: { $all: ["CSS"] } })
  res.send(allusers)
})
*/

module.exports = router;
