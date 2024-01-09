// Create web server with Express
// Load the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');
const app = express();

// Configure the server
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load the comments
let comments = require('./data/comments.json');

// Return all the comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Add a comment
app.post('/comments', (req, res) => {
  const newComment = {
    id: uuid(),
    name: req.body.name,
    comment: req.body.comment,
    timestamp: Date.now()
  };

  comments.unshift(newComment);
  fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
    if (err) {
      console.error(err);
    }
    res.json(comments);
  });
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
  const id = req.params.id;
  comments = comments.filter(comment => comment.id !== id);
  fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
    if (err) {
      console.error(err);
    }
    res.json(comments);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});