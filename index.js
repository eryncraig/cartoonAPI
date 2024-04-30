const express = require('express');
morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid')

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let users = [
  {
    'id': 1,
    'name': 'John Michael',
    'username': 'Johnny94',
    'birthdate': '1994-04-05',
    'favorites': []
  },
  {
    'id': 2,
    'name': 'Sala Ahmed',
    'username': 'FireKing11',
    'birthdate': '1976-09-23',
    'favorites': []
  },
  {
    'id': 3,
    'name': 'Jody Winters',
    'username': 'Chevalier86',
    'birthdate': '1986-11-18',
    'favorites': []
  }
]

//Note: birthdates are in YYYY-MM-DD format
const movies = [
  {
    'title': 'Nausicaa',
    'summary': 'Warrior and pacifist Princess Nausicaä desperately struggles to prevent two warring nations from destroying themselves and their dying planet.',
    'director': {
      'name': 'Hayao Miyazaki',
      'birthdate': '1910-03-23'
    },
    'actors': {
      'star': {
        'name': 'Sumi Shimamoto',
        'birthdate': '1954-12-08'
      },
      'support': {
        'name': 'Mahito Tsujimura',
        'birthdate': '1930-04-14'
      }
    },
    'year': 1984,
    'genre': {
      'name': 'Scifi',
      'definition': 'Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called "speculative fiction". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place.'
    }
  },
  {
    'title': 'Only Yesterday',
    'summary': 'A twenty-seven-year-old office worker travels to the countryside while reminiscing about her childhood in Tokyo.',
    'director': {
      'name': 'Isao Takahata',
      'birthdate': '1935-10-29'
    },
    'year': 1996,
    'genre': {
      'name': 'Drama',
      'definition': 'Drama films are serious, plot-driven stories that follow real characters and their conflicts with themselves, others, or forces of nature. They often rely on current events and social and political issues for thematic reference. Drama films are intended to be more serious than humorous in tone and rely heavily on the emotional and relational development of realistic characters.'
    }
  },
  {
    'title': 'Akira',
    'summary': 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.',
    'director': {
      'name': 'Katsuhiro Otomo',
      'birthdate': '1954-04-14'
    },
    'year': 1988,
    'genre': {
      'name': 'Scifi',
      'definition': 'Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called "speculative fiction". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place.'
    }
  },
  {
    'title': 'Tekkonkinkreet',
    'summary': 'Two boys defend Treasure Town and Yakuza try to take over and clear it for new development.',
    'director': {
      'name': 'Hiroaki Ando',
      'birthdate': '1966'
    },
    'year': 2006,
    'genre': {
      'name': 'Psychological',
      'definition': 'Psychological fiction, also known as psychological realism, is a literary genre that focuses on the inner lives of characters, exploring their mental, emotional, and spiritual states. In this genre, the plot is driven by the characters\' inner motivations rather than external forces.'
    }
  },
  {
    'title': 'The Thief and The Cobbler',
    'summary': 'A lonely princess and a poor cobbler fall in love while trying to retrieve three magical orbs that were stolen by a bumbling thief, all while outwitting a powerful sorcerer as adventure and comedic pop culture references abound.',
    'director': {
      'name': 'Richard Williams',
      'birthdate': '1933-03-13'
    },
    'year': 1993,
    'genre': {
      'name': 'Fantasy',
      'definition': 'Fantasy films are a type of speculative fiction that feature imaginative themes such as magic, mythology, supernatural events, folklore, or exotic fantasy worlds. They often include elements of wonder, escapism, and the extraordinary. Fantasy films can represent hopes and desires for better or alternative worlds, and have contributed significantly to the development of cinema.'
    }
  },
  {
    'title': 'Paprika',
    'summary': 'When a machine that allows therapists to enter their patients\' dreams is stolen, all hell breaks loose. Only a young female therapist, Paprika, can stop it.',
    'director': {
      'name': 'Satoshi Kon',
      'birthdate': '1963-10-12'
    },
    'year': 2006,
    'genre': {
      'name': 'Scifi',
      'definition': 'Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called "speculative fiction". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place.'
    }
  },
  {
    'title': 'Atlantis: The Lost Empire',
    'summary': 'A young linguist named Milo Thatch joins an intrepid group of explorers to find the mysterious lost continent of Atlantis.',
    'director': {
      'name': 'Gary Trousdale',
      'birthdate': '1960-06-08'
    },
    'year': 2001,
    'genre': {
      'name': 'Scifi',
      'definition': 'Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called "speculative fiction". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place.'
    }
  },
  {
    'title': 'Ghost in the Shell',
    'summary': 'A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master.',
    'director': {
      'name': 'Mamoru Oshii',
      'birthdate': '1951-08-08'
    },
    'year': 1995,
    'genre': {
      'name': 'Scifi',
      'definition': 'Science fiction (sci-fi) is a genre of fiction that incorporates real or imagined science and technology into its plot, setting, or theme. It\'s often futuristic and speculative, and sometimes called "speculative fiction". Science fiction stories envision alternative worlds with consistent rules and structures, set apart from the ordinary world of our time and place.'
    }
  },
  {
    'title': 'Prince of Egypt',
    'summary': 'Egyptian Prince Moses learns of his identity as a Hebrew and his destiny to become the chosen deliverer of his people.',
    'director': {
      'name': 'Brenda Chapman',
      'birthdate': '1962-11-01'
    },
    'year': 1998,
    'genre': {
      'name': 'Drama',
      'definition': 'Drama films are serious, plot-driven stories that follow real characters and their conflicts with themselves, others, or forces of nature. They often rely on current events and social and political issues for thematic reference. Drama films are intended to be more serious than humorous in tone and rely heavily on the emotional and relational development of realistic characters.'
    }
  },
  {
    'title': 'Wizards',
    'summary': 'On a post-apocalyptic Earth, a wizard and his faire folk comrades fight an evil wizard who\'s using technology in his bid for conquest.',
    'director': {
      'name': 'Ralph Bakshi',
      'birthdate': '1938-10-29'
    },
    'year': 1977,
    'genre': {
      'name': 'Fantasy',
      'definition': 'Fantasy films are a type of speculative fiction that feature imaginative themes such as magic, mythology, supernatural events, folklore, or exotic fantasy worlds. They often include elements of wonder, escapism, and the extraordinary. Fantasy films can represent hopes and desires for better or alternative worlds, and have contributed significantly to the development of cinema.'
    }
  },
]

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));
app.use(bodyParser.json());

//endpoint for the homepage of the site
app.get('/', (req, res) => {
  res.send('Welcome to my cartoon database!')
});

//endpoint to add a new user (request must be sent in the body)
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('User is missing a name.')
  }
});


//endpoint to update a users' username (themselves)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id === Number(id));

  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else {
    res.status(400).send('Unable to update that user.')
  };
});


//endpoint to add a movie to a users list of favorites (I'm using update as opposed to create (CRUD))
app.put('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id === Number(id));

  if (user) {
    user.favorites.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites.`);
  } else {
    res.status(400).send('Sorry! We\'re unable to update your favorites.')
  };
});


//endpoint to remove a movie from a users list of favorites 
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id === Number(id));

  if (user) {
    user.favorites = user.favorites.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorites.`);
  } else {
    res.status(400).send('Sorry! We\'re unable to update your favorites.')
  };
});


//endpoint to remove a user and their email from the datatbase
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id === Number(id));

  if (user) {
    users = users.filter(user => user.id !== Number(id));
    res.status(200).send(`User ${id} has been removed.`);
  } else {
    res.status(400).send('Sorry! We\'re unable to update your account.')
  };
});


//endpoint to retrieve a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});


//endpoint to retrieve a movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie =>
    movie.title === title
  );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('Sorry, no movie found with that title.')
  }
});


//endpoint to retrieve information about a genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie =>
    movie.genre.name === genreName
  ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Sorry, no genre found with that name.')
  }
});


//endpoint to retrieve information about a director
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Sorry, no director found with that name.')
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});