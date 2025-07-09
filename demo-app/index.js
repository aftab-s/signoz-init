require('./tracing');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the observable world!');
});

app.get('/slow', (req, res) => {
  setTimeout(() => {
    res.send('This was a slow request!');
  }, 2000);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
