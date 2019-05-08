
const { User } = require('../passport');
const user = require('../controller/user');
const log = require('debug')('chat-api:route:auth:user');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {

  router.post('/auth/login', catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ error: { code: 401, message: "Login requires email and password" } });
    }

    const token = await user.signIn(email, password);

    if (token) {
      log(green("User successfully logged in"));
      return res.json({ users: ['pepital', 'gertrudis', 'jaime'], token });
    } else {
      log(yellow("User was not logged in"));
      return res.json({ loggedIn: false });
    }

  }));

  router.post('/auth/signUp', catchAsyncErrors(async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.json({ error: { code: 401, message: "For sign up email, password and username are required" } });
    }
    const signedUp = await user.signUp(req.body)
    // .catch(e => {
    //   return res.json({ error:{ code: 401, message:e.message}});
    // });
    if (signedUp && signedUp.token) {
      log(green("User successfully signed up"));
      return res.json({ status: 'Ok', message: 'User successfuly signed up', token: signedUp.token });
    } else {
      const { message } = signedUp.error;
      log(yellow(`User was not signed up reason: ${message}`));
      return res.json(signedUp);
    }
  }));
};
