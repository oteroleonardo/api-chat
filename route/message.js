
const { hasAccess, handleUnauthorized} = require('../passport');
const msg = require('../controller/message');
const log = require('debug')('chat-api:route:message');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {
  router.get('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      log( '---------- req.user: ', green(JSON.stringify(req.user, null,2)), '----------');
      log( '---------- tokenPayload: ', green(JSON.stringify(req.tokenPayload, null,2)), '----------');
      // if (!receiver) {
      //   return res.json({ error: { code: 401, message: "Message sending requires: sender, receiver and message" } });
      // }    

      const result = await msg.receive(req.user);
  
      if (result && !result.error) {
        log(result);
        return res.json(result);
      } else {
        log(red(result.error.message));
        return res.json(result.error || {error: {code:501, message: 'Unknown internal error retrieving messages'}});
      }
    }),
    handleUnauthorized, // change this for a different behavior
  );  
  router.post('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      const {receiver, relatedToMessage, message} = req.body;
      const {username: sender} = req.user.attributes; 

      log(green(`Sending message from ${sender} to [${receiver}]`));

      if ((!receiver && !relatedToMessage)  || !message) {
        return res.json({ error: { code: 401, message: "Message sending requires: (receiver or relatedToMessage) and message" } });
      }    

      const result = await msg.send({sender , receiver, message, relatedToMessage});
      console.log('result: ', result);
      if (result && !result.error) {
        log(green("message sent"));
        return res.json(result);
      } else {
        const msge = result&result.error?result.error.message : 'Error sending message';
        log(red(msge));
        return res.json({ error: {code: 401, message: msge}});
      }
    }),
    handleUnauthorized, // change this for a different behavior
  );
};
