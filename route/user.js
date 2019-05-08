
const { hasAccess, handleUnauthorized, User, passport } = require('../passport');
const log = require('debug')('chat-api:route:user');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {


  // router.get('/user', passport.authenticate('jwt', {session: false, failWithError: true }), 
  //   //catchAsyncErrors(async 
  //     function (req, res) => {
  //     log('called')
  //     return res.json([{ 'user': 'World' }]);
  //   }, 
  //   function (err, req, res) => {
  //     const message = err.message || '';
  //     return res.json({error: {code: 401, message}}); 
  //   }
  //   //)
  //   );

  router.get('/user',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      return res.json({ success: true, message: 'Logged in' })
    }),
    handleUnauthorized, // change this for a different behavior
  );

}
