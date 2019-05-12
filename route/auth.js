
const { hasAccess, handleUnauthorized } = require('../passport');
const user = require('../controller/user');
const log = require('debug')('chat-api:route:auth:user');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {

  router.post('/auth/login', catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ error: { code: 401, message: "Login requires email and password" } });
    }
    const { users, token } = await user.signIn(email, password);

    if (token) {
      return res.json({ users, token });
    } else {
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

  router.get('/auth/refresh',
    hasAccess,
    catchAsyncErrors(async (req, res) => {
      const { email, id, username, status } = req.tokenPayload;
      const token = await user.refresh({ email, id, username, status });

      if (token) {
        log(green("User token successfully refreshed"));
        return res.json({ token });
      } else {
        log(yellow("User was not logged in"));
        return res.json({ loggedIn: false });
      }

    }),
    handleUnauthorized, // change this for a different behavior
  );

};
