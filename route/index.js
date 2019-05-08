const express = require('express');
const log = require('debug')('chat-api:app');
const { red, green, yellow } = require('chalk');
const router = express.Router();

const fs = require('fs');
const validFileTypes = ['js'];

const catchAsyncErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next)
      .catch(err => {
        const message = err?err.message : 'Unknown internal error';
        log(red('Error calling controller: ', err));
        return { error: { code: 501, message } };
      });

  }
}

const requireFiles = (directory) => {
  fs.readdirSync(directory).forEach(function (fileName) {

    // Recurse if directory
    if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      requireFiles(directory + '/' + fileName);
    } else {
      // Skip this file
      if (fileName === 'index.js' && directory === __dirname) return;
      // Skip unknown filetypes
      if (validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;

      // Require the route file.
      log(green('Loading router: ' + directory + '/' + fileName));
      require(directory + '/' + fileName)(router, catchAsyncErrors);
    }
  })

}
requireFiles(__dirname);

module.exports = router;
