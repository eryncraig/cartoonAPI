const express = require('express');
morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

const favoriteMovies = [
  {
    'Title': 'Nausicaa',
    'Director': 'Hayao Miyazaki',
    'Year': 1984
  },
  {
    'Title': 'Only Yesterdat',
    'Director': 'Isao Takahata',
    'Year': 1996
  },
  {
    'Title': 'Akira',
    'Director': 'Katsuhiro Otomo',
    'Year': 1988
  },
  {
    'Title': 'Tekkonkinkreet',
    'Director': 'Hiroaki Ando',
    'Year': 2006
  },
  {
    'Title': 'The Thief and The Cobbler',
    'Director': 'Richard Williams',
    'Year': 1993
  },
  {
    'Title': 'Paprika',
    'Director': 'Satoshi Kon',
    'Year': 2006
  },
  {
    'Title': 'Atlantis: The Lost Empire',
    'Director': 'Gary Trousdale',
    'Year': 2001
  },
  {
    'Title': 'Ghost in the Shell',
    'Director': 'Mamoru Oshii',
    'Year': 1995
  },
  {
    'Title': 'Prince of Egypt',
    'Director': 'Brenda Chapman',
    'Year': 1998
  },
  {
    'Title': 'Wizards',
    'Director': 'Ralph Bakshi',
    'Year': 1977
  },
]

app.use(morgan('combined', { stream: accessLogStream }));


app.get('/', (req, res) => {
  res.send('Welcome to my cartoon database!')
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documetation.html', { root: __dirname })
})

app.get('/movies', (req, res) => {
  res.json(favoriteMovies);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});