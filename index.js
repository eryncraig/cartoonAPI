const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose");

const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/cartoonDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

const { check, validationResult } = require('express-validator');

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" });

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const passport = require('passport');
const { hash } = require("crypto");
require('./passport.js')


//endpoint for the homepage of the site
app.get("/", (req, res) => {
  res.send("Welcome to my cartoon database!")
});

//endpoint to ADD a new user (request must be sent in the body); update 5/13/24, now using recommended promise syntax per Mongoose and MongoDB recommendation. Also connecting to officially created db now. However still using MongoDB 5.0 as anything above/newer requires an Atlas cluster as opposed to a local host.
app.post("/users", [
  check('username', 'Username is required and must be over 5 characters.').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters, which is not allowed.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('email', 'Email does not appear to be valid.').isEmail()
], async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.password);

  await Users.findOne({ Username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + ' already exists.');
    } else {
      Users
        .create({
          username: req.body.username,
          name: req.body.name,
          password: hashedPassword,
          email: req.body.email,
          birthdate: req.body.birthdate
        }).then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//temporary logic to GET a list of all users using Mongoose schema
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//GET a user by username
app.get('/users/:username', async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Logic to UPDATE user data via username 
app.put("/users/:username", [
  check('username', 'Username must be at least 5 characters long.').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters, which is not allowed.').isAlphanumeric(),
  check('email', 'Email must be in a valid format.').isEmail()
], passport.authenticate('jwt', { session: false }), async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.user.username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }

  await Users.findOneAndUpdate({ username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthdate: req.body.birthdate
      }
    },
    { new: true }
  ).then((updatedUser) => {
    res.json(updatedUser);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});


//endpoint to add a movie to a users list of favorites (I"m using update/put as opposed to create/post (CRUD)); authentication implemented
app.put("/users/:username/movies/:movieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }

  await Users.findOneAndUpdate({ username: req.params.username },
    { $addToSet: { favorites: req.params.movieID } },
    { new: true }
  ).then((updatedUser) => {
    res.json(updatedUser);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//endpoint to remove a movie from a users list of favorites 
app.delete("/users/:username/movies/:movieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(400).send('Permission denied.');
  }

  await Users.findOneAndUpdate({ username: req.params.username },
    { $pull: { favorites: req.params.movieID } },
    { new: true }
  ).then((updatedUser) => {
    res.json(updatedUser);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//endpoint to DELETE a user and all of their data from the database by username
app.delete("/users/:username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(400).send('Permission denied.')
  }

  await Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//endpoint to retrieve a list of all movies
app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//endpoint to retrieve a movie by title
app.get("/movies/:title", async (req, res) => {
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//endpoint to retrieve information about a genre 
app.get("/movies/genre/:genreName", async (req, res) => {
  await Movies.findOne({ 'genre.name': req.params.genreName }, { 'genre': 1, '_id': 0 })
    .then((genre) => {
      res.json(genre);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//endpoint to retrieve information about a director
app.get("/movies/director/:directorName", async (req, res) => {
  await Movies.findOne({ 'director.name': req.params.directorName }, { 'director': 1, '_id': 0 })
    .then((director) => {
      res.json(director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
  console.log("Listening on Port " + port);
});