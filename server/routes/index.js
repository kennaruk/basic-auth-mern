var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var session = require('express-session');

router.use(session({
  secret: 'KENNARUK'
}));

router.use(bodyParser.json());
const saltRound = 10;

mongoose.connect('mongodb://localhost')

var auth = (req, res, next) => {
  if(req.session.login)
    next()
  else
    res.send('not login')
};

var middleware = (req, res, next) => {
  console.log('middleware')
  next()
}

const userSchema = new Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', auth, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/get/:dd', (req, res, next) => {
  res.json({
    params: req.params,
    query: req.query
  })
});

router.get('/user', (req, res, next) => {
  User.find().then((users) => {
    console.log(users)
    res.json(users);
  });
});

router.get('/login', (req, res, next) => {
  req.session.login = true;
  res.json({
    success: true
  })
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.json({
    success: true
  })
})

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}).then((user) => {
    bcrypt.compare(password, user.password, (err, match) => {
      if(match) {
        req.session.login = true;
        res.json({
          success: true
        })
      }
      else
        res.json({
          success: false
        })
        
    });
  });
});

router.post('/register', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  bcrypt.hash(password, saltRound, (err, hash) => {
    let user = new User({
      username: username,
      password: hash
    });
    user.save().then(() => {
      res.json({
        success: true
      })
    }).catch(err => {
      res.json({
        err: err
      })
    })
  });
})
module.exports = router;
