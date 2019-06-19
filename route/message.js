
const { hasAccess, handleUnauthorized} = require('../passport');
const msg = require('../controller/message');
const log = require('debug')('chat-api:route:message');
const { red, green, yellow } = require('chalk');

module.exports = (router, catchAsyncErrors) => {
  router.get('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      log( '---------- req.user: ', green(JSON.stringify(req.user.attributes, null,2)), '----------');
      log( '---------- tokenPayload: ', green(JSON.stringify(req.tokenPayload, null,2)), '----------');
      // if (!receiver) {
      //   return res.json({ error: { code: 401, message: "Message sending requires: sender, receiver and message" } });
      // }    

      const result = await msg.receive(req.user.attributes);
  
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
  router.patch('/message',
    hasAccess,
    catchAsyncErrors(async (req, res, next) => {
      // Handle success
      const {id, readed, message, relatedToMessage, receiver} = req.body;
      const {username: sender} = req.user.attributes; 

      log(green(`Updating message ${id} with readed: ${readed} from ${sender} to [${receiver}]`));

      if ((!id && typeof readed === 'undefined') && (!message && !relatedToMessage)){
        return res.json({ error: { code: 401, message: "Message update requires: (id and readed or message and relatedToMessage)" } });
      }    

      const result = await msg.update({id, readed, sender ,  message, relatedToMessage, receiver});
      console.log('patch result: ', result);
      if (result && !result.error) {
        log(green("message sent"));
        return res.json(result);
      } else {
        const msge = result&result.error?result.error.message : 'Error updating message';
        log(red(msge));
        return res.json({ error: {code: 401, message: msge}});
      }
    }),
    handleUnauthorized, // change this for a different behavior
  );

};
