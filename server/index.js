const express = require('express'),
app = express();

app.listen(8080, err => {
  if (err) throw err;
  console.log('Hello');
});

const mongoose = require("mongoose");

// Database Connection
mongoose.connect('', {
    useNewUrlParser: true
});
