const User = require('../model/user');
const jwt = require('jsonwebtoken');
const log = require('debug')('chat-api:controller:user');
const { red, green, yellow } = require('chalk');

const signUp = async (usr) => {
  const user = new User({ ...usr });
  try {
    const savedUser = await user.save()
    if (typeof savedUser === 'undefined') {
      // User not saved, send back no token
      const message = 'Error user was not saved';
      log(red(`Error in signUp: ${message}`));
      return {error: {code: 401, message}};
    } else {
      // User saved, send back token with user info
      const userStoredData = savedUser.attributes;
  
      delete userStoredData.password_digest;
      const createdOn = new Date().getTime() + process.env.TOKEN_EXPIRATION*60000;
      const token = jwt.sign({ ...userStoredData, createdOn }, process.env.SECRET_OR_KEY);
      return {token};
    }
  } catch(err) {
    const message = (err.code === '23505')? 'Duplicated user (23505)':'DB error saving user';
    //log(red(`Error saving user: ${message}`));
    return {error: {code: 401, message}};
  };
  log(red(savedUser.code, savedUser.err));


}

const signIn = async (email, password) => {
  log(green('Calling signIn with email: ', email));
  const user = await User.forge({ email }).fetch()
    .catch(err => {
      log(red('Error retrieving from DB user: ', email, ' - err:', err));
      return undefined;
    });

  if (user) {
    const authUser = await user.authenticate(password)
      .catch(err => {
        log(red('Authentication failed for user: ', email, ' - err:', err));
        return undefined;
      });

    if (authUser) {
      log(green('User was signed in'));
      const userStoredData = authUser.attributes;
      delete userStoredData.password_digest;
      const createdOn = new Date().getTime() + process.env.TOKEN_EXPIRATION*60000;
      const authToken = jwt.sign({ ...userStoredData, createdOn }, process.env.SECRET_OR_KEY);
      return authToken;

    }
  }

  return undefined;

};

module.exports = {
  signUp,
  signIn,
}
