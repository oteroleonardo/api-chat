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
      return { error: { code: 401, message } };
    } else {
      // User saved, send back token with user info
      const userStoredData = savedUser.attributes;

      delete userStoredData.password_digest;
      const signOptions = {
        algorithm: 'HS512',
        expiresIn: `${process.env.TOKEN_EXPIRATION}s`, //token expiration indicated in seconds
      }
      log()
      const token = jwt.sign({ ...userStoredData }, process.env.SECRET_OR_KEY, signOptions);
      return { token };
    }
  } catch (err) {
    const message = (err.code === '23505') ? 'Duplicated user (23505)' : 'DB error saving user';
    //log(red(`Error saving user: ${message}`));
    return { error: { code: 401, message } };
  };
  log(red(savedUser.code, savedUser.err));

};

const update = async (usr) => {
  log(`usr: ${JSON.stringify(usr)}`)
//  const { id, username, status, password, email } = usr; 
  const user = new User({...usr});
  try {
    const savedUser = await User.forge({...usr}).save();//null, {method: 'update'});
    if (typeof savedUser === 'undefined') {
      // User not saved, send back no token
      const message = 'Error user was not updated';
      log(red(`Error in user update: ${message}`));
      return { error: { code: 401, message } };
    } else {
      // User saved, send back token with user info
      const userStoredData = savedUser.attributes;

      delete userStoredData.password_digest;
      const signOptions = {
        algorithm: 'HS512',
        expiresIn: `${process.env.TOKEN_EXPIRATION}s`, //token expiration indicated in seconds
      }
      log()
      const token = jwt.sign({ ...userStoredData }, process.env.SECRET_OR_KEY, signOptions);
      return { result: true}; //, token };
    }
  } catch (err) {
    log(err);
    const message = (err.code === '23505') ? 'Duplicated user (23505)' : 'DB error saving user';
    //log(red(`Error saving user: ${message}`));
    return { error: { code: 401, message } };
  };

};

const signIn = async (email, password) => {
  log(green('Calling signIn with email: ', email));
  const user = await User.forge({ email }).fetch()
    .catch(err => {
      log(red('Error retrieving from DB user: ', email, ' - err:', err.message));
      return {};
    });

  if (user) {
    //let isAutenticated = true;
    const authUser = await user.authenticate(password)
      .catch(err => {
        log(red('Authentication failed for user: ', email, ' - err:', err.message));
      });

    if (authUser) {
      log(green('User ${email} successfully signed in'));
      await User.forge({...user.attributes, status: 'connected'}).save();
      const userStoredData = authUser.attributes;
      delete userStoredData.password_digest;
      const signOptions = {
        algorithm: 'HS512',
        expiresIn: `${process.env.TOKEN_EXPIRATION}s`, //token expiration indicated in seconds
      }
      const token = jwt.sign({ ...userStoredData }, process.env.SECRET_OR_KEY, signOptions);
      const {users} = await contacts()
        .catch(err => {
          log(red('Error retrieving contacts from DB', ' - err:', err.stack));
        }) || [];
      return { users, token };

    } else {
      log(yellow(`Wrong password for user: ${email}`));
    }
  }

  return {};

};

const refresh = async (user) => {
  const {email} = user;
  log(green(`Calling refresh with email: ${email}`));
  const usr = await User.forge({ email }).fetch()
    .catch(err => {
      log(red('Error retrieving from DB user: ', email, ' - err:', err));
      return undefined;
    });

  if (usr) {
    log(green('User found in DB'));
    const userStoredData = usr.attributes;
    delete userStoredData.password_digest;
    const signOptions = {
      algorithm: 'HS512',
      expiresIn: `${process.env.TOKEN_EXPIRATION}s`, //token expiration indicated in seconds
    }
    const authToken = jwt.sign({ ...userStoredData }, process.env.SECRET_OR_KEY, signOptions);
    return authToken;
  }
  return undefined;

};

const contacts = async () => {
  log(green('Calling contacts'));
  const users = await User.forge({username: /e/ }).fetchAll()
    .catch(err => {
      log(red('Error retrieving user from DB email: ', email, ' - err:', err.stack));
      return undefined;
    });
  if (users && users.size()) {
    log(green(`${users.size()} contacts found in DB`));
  } else {
    log(green('Contacts not found in DB'));
  }
  return {users: users.map(u => {
    return u.attributes
  })};

};

module.exports = {
  signUp,
  signIn,
  refresh,
  contacts,
  update,
}
