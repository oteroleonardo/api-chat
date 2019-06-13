require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const log = require('debug')('chat-api:app');
const {red, green, yellow} = require('chalk'); 
const logger = require('morgan');
const {passport} = require('./passport');
const router = require('./route');

const app = express();

// CORS configuration
const whitelist = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
];
const corsOptions = {
  origin: whitelist,
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
  // Use cors
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(`/api/v${process.env.VERSION}`, router);

app.use((req, res, next) => {
  const message = 'Error: Invalid API route';
  log(red(message));
  res.json({ error: { code: 404, message } });
  next();
});

// Unhandled error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  const message = err.message || 'Unknown Error';
  log(red('Unhandled error: '), err);
  res.json({ error: { code: 501, message } });
  next();
});




module.exports = app;
