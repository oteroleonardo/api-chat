
const { hasAccess, handleUnauthorized, passport } = require('../passport');
const msg = require('../controller/message');
const log = require('debug')('chat-api:route:message');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {
  router.get('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      log( '----------', green(JSON.stringify(req.user)), '----------');
      // if (!receiver) {
      //   return res.json({ error: { code: 401, message: "Message sending requires: sender, receiver and message" } });
      // }    

      const result = await msg.receive(req.user);
  
      if (result) {
        log(green("message sent"));
        return res.json(result);
      } else {
        const msge = 'Message not sent try again later';
        log(red(msge));
        return res.json({ error: {code: 401, message: msge}});
      }
    }),
    handleUnauthorized, // change this for a different behavior
  );  
  router.post('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      const { sender, receiver, message} = req.body;
 
      if (!sender || !receiver || !message) {
        return res.json({ error: { code: 401, message: "Message sending requires: sender, receiver and message" } });
      }    

      const result = await msg.send({sender , receiver, message});
  
      if (result) {
        log(green("message sent"));
        return res.json(result);
      } else {
        const msge = 'Message not sent try again later';
        log(red(msge));
        return res.json({ error: {code: 401, message: msge}});
      }
    }),
    handleUnauthorized, // change this for a different behavior
  );
};
