const express = require('express');
morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

//Note: birthdates are in YYYY-MM-DD format
const favoriteMovies = [
  {
    'Title': 'Nausicaa',
    'Director': {
      'name': 'Hayao Miyazaki',
      'birthdate': '1910-03-23'
    },
    'Year': 1984
  },
  {
    'Title': 'Only Yesterday',
    'Director': {
      'name': 'Isao Takahata',
      'birthdate': '1935-10-29'
    },
    'Year': 1996
  },
  {
    'Title': 'Akira',
    'Director': {
      'name': 'Katsuhiro Otomo',
      'birthdate': '1954-04-14'
    },
    'Year': 1988
  },
  {
    'Title': 'Tekkonkinkreet',
    'Director': {
      'name': 'Hiroaki Ando',
      'birthdate': '1966'
    },
    'Year': 2006
  },
  {
    'Title': 'The Thief and The Cobbler',
    'Director': {
      'name': 'Richard Williams',
      'birthdate': '1933-03-13'
    },
    'Year': 1993
  },
  {
    'Title': 'Paprika',
    'Director': {
      'name': 'Satoshi Kon',
      'birthdate': '1963-10-12'
    },
    'Year': 2006
  },
  {
    'Title': 'Atlantis: The Lost Empire',
    'Director': {
      'name': 'Gary Trousdale',
      'birthdate': '1960-06-08'
    },
    'Year': 2001
  },
  {
    'Title': 'Ghost in the Shell',
    'Director': {
      'name': 'Mamoru Oshii',
      'birthdate': '1951-08-08'
    },
    'Year': 1995
  },
  {
    'Title': 'Prince of Egypt',
    'Director': {
      'name': 'Brenda Chapman',
      'birthdate': '1962-11-01'
    },
    'Year': 1998
  },
  {
    'Title': 'Wizards',
    'Director': {
      'name': 'Ralph Bakshi',
      'birthdate': '1938-10-29'
    },
    'Year': 1977
  },
]

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('Welcome to my cartoon database!')
});

app.get('/movies', (req, res) => {
  res.json(favoriteMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});