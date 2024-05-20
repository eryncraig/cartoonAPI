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



// let users = [
//   {
//     "name": "John Michael",
//     "username": "Johnny94",
//     "email": "johnm@somemail.com",
//     "birthdate": new Date("1994-04-05"),
//     "favorites": []
//   },
//   {
//     "name": "Sala Ahmed",
//     "username": "FireKing11",
//     "email": "fireking@somemail.com",
//     "birthdate": new Date("1976-09-23"),
//     "favorites": []
//   },
//   {
//     "name": "Jody Winters",
//     "username": "Chevalier86",
//     "email": "jwknight@somemail.com",
//     "birthdate": new Date("1986-11-18"),
//     "favorites": []
//   }
// ]

//Note: birthdates are in YYYY-MM-DD format
// const movies = [
//   {
//     "title": "Nausicaa",
//     "summary": "Warrior and pacifist Princess Nausicaä desperately struggles to prevent two warring nations from destroying themselves and their dying planet.",
//     "director": {
//       "name": "Hayao Miyazaki",
//       "birthdate": "1910-03-23"
//     },
//     "year": 1984,
//     "genre": {
//       "name": "Scifi",
//       "definition": "Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called \"speculative fiction\". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place."
//     }
//   },
//   {
//     "title": "Only Yesterday",
//     "summary": "A twenty-seven-year-old office worker travels to the countryside while reminiscing about her childhood in Tokyo.",
//     "director": {
//       "name": "Isao Takahata",
//       "birthdate": "1935-10-29"
//     },
//     "year": 1996,
//     "genre": {
//       "name": "Drama",
//       "definition": "Drama films are serious, plot-driven stories that follow real characters and their conflicts with themselves, others, or forces of nature. They often rely on current events and social and political issues for thematic reference. Drama films are intended to be more serious than humorous in tone and rely heavily on the emotional and relational development of realistic characters."
//     }
//   },
//   {
//     "title": "Akira",
//     "summary": "A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.",
//     "director": {
//       "name": "Katsuhiro Otomo",
//       "birthdate": "1954-04-14"
//     },
//     "year": 1988,
//     "genre": {
//       "name": "Scifi",
//       "definition": "Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called \"speculative fiction\". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place."
//     }
//   },
//   {
//     "title": "Tekkonkinkreet",
//     "summary": "Two boys defend Treasure Town and Yakuza try to take over and clear it for new development.",
//     "director": {
//       "name": "Hiroaki Ando",
//       "birthdate": "1966"
//     },
//     "year": 2006,
//     "genre": {
//       "name": "Psychological",
//       "definition": "Psychological fiction, also known as psychological realism, is a literary genre that focuses on the inner lives of characters, exploring their mental, emotional, and spiritual states. In this genre, the plot is driven by the characters\' inner motivations rather than external forces."
//     }
//   },
//   {
//     "title": "The Thief and The Cobbler",
//     "summary": "A lonely princess and a poor cobbler fall in love while trying to retrieve three magical orbs that were stolen by a bumbling thief, all while outwitting a powerful sorcerer as adventure and comedic pop culture references abound.",
//     "director": {
//       "name": "Richard Williams",
//       "bio": "Richard Edmund Williams was a Canadian-British animator, voice actor, and painter. ",
//       "birthdate": "1933-03-13",
//       "death": "2019-16-08"
//     },
//     "year": 1993,
//     "genre": {
//       "name": "Fantasy",
//       "definition": "Fantasy films are a type of speculative fiction that feature imaginative themes such as magic, mythology, supernatural events, folklore, or exotic fantasy worlds. They often include elements of wonder, escapism, and the extraordinary. Fantasy films can represent hopes and desires for better or alternative worlds, and have contributed significantly to the development of cinema."
//     }
//   },
//   {
//     "title": "Paprika",
//     "summary": "When a machine that allows therapists to enter their patients' dreams is stolen, all hell breaks loose. Only a young female therapist, Paprika, can stop it.",
//     "director": {
//       "name": "Satoshi Kon",
//       "bio": "Satoshi Kon was a Japanese film director, animator, screenwriter and manga artist from Sapporo, Hokkaido, and a member of the Japanese Animation Creators Association.",
//       "birthdate": "1963-10-12",
//       "death": "2010-08-24"
//     },
//     "year": 2006,
//     "genre": {
//       "name": "Scifi",
//       "definition": "Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It's often futuristic and speculative, and sometimes called \"speculative fiction\". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place."
//     },
//     "imagePath": "public/paprikaposter.jpeg",
//     "featured": true
//   },
//   {
//     "title": "Atlantis: The Lost Empire",
//     "summary": "A young linguist named Milo Thatch joins an intrepid group of explorers to find the mysterious lost continent of Atlantis.",
//     "director": {
//       "name": "Gary Trousdale",
//       "birthdate": "1960-06-08"
//     },
//     "year": 2001,
//     "genre": {
//       "name": "Scifi",
//       "definition": "Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called \"speculative fiction\". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place."
//     }
//   },
//   {
//     "title": "Ghost in the Shell",
//     "summary": "A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master.",
//     "director": {
//       "name": "Mamoru Oshii",
//       "birthdate": "1951-08-08"
//     },
//     "year": 1995,
//     "genre": {
//       "name": "Scifi",
//       "definition": "Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called \"speculative fiction\". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place."
//     }
//   },
//   {
//     "title": "Prince of Egypt",
//     "summary": "Egyptian Prince Moses learns of his identity as a Hebrew and his destiny to become the chosen deliverer of his people.",
//     "director": {
//       "name": "Brenda Chapman",
//       "birthdate": "1962-11-01"
//     },
//     "year": 1998,
//     "genre": {
//       "name": "Drama",
//       "definition": "Drama films are serious, plot-driven stories that follow real characters and their conflicts with themselves, others, or forces of nature. They often rely on current events and social and political issues for thematic reference. Drama films are intended to be more serious than humorous in tone and rely heavily on the emotional and relational development of realistic characters."
//     }
//   },
//   {
//     "title": "Wizards",
//     "summary": "On a post-apocalyptic Earth, a wizard and his faire folk comrades fight an evil wizard who\'s using technology in his bid for conquest.",
//     "director": {
//       "name": "Ralph Bakshi",
//       "birthdate": "1938-10-29"
//     },
//     "year": 1977,
//     "genre": {
//       "name": "Fantasy",
//       "definition": "Fantasy films are a type of speculastive fiction that feature imaginative themes such as magic, mythology, supernatural events, folklore, or exotic fantasy worlds. They often include elements of wonder, escapism, and the extraordinary. Fantasy films can represent hopes and desires for better or alternative worlds, and have contributed significantly to the development of cinema."
//     }
//   },
// ]


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
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
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