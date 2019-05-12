const Message = require('../model/message');
const log = require('debug')('chat-api:controller:message');
const { red, green, yellow } = require('chalk');

const send = async (message) => {
  let messg = { ...message };

  if(messg.relatedToMessage){
    const relatedMsg = (await Message.forge({id: messg.relatedToMessage}).fetch()
      .catch(err => {
        log(red(`Error code: (${err.code}) retrieving related message sender: `, err.message));
        const msge ='Error looking for indicated relatedToMessage';
        return { error: { code: 401, message: msge } };
      }));

      if(relatedMsg && !relatedMsg.error){
        const { sender: originalSender } = relatedMsg.attributes;
        log(green(`Successfuly retrieved original sender: ${originalSender} for relatedToMessage: ${messg.relatedToMessage}`));
        messg.receiver =  originalSender; 
      } else {
        return relatedMsg && relatedMsg.error? relatedMsg.error: { error: { code: 401, message: 'Wrong relatedToMessage' } };
      }
  }
  console.log("------------ Step 1");
  const msg = new Message(messg);
  const savedMessage = await msg.save()
    .catch(err => {
      log(red(`Error code: (${err.code}) saving message: `, err.message));
      const msge = err.code == 23503? 'Wrong relatedToMessage o receiver' : 'Error saving message';
      return { error: { code: 401, message: msge } };
    });
    console.log("------------ Step 2");

  if (typeof savedMessage === 'undefined' || savedMessage.error) {
    console.log("------------ Step 3");

    // Message not saved, send back error
    const message = savedMessage&& savedMessage.error? savedMessage.error.message : 'Error saving message';
    const code = savedMessage&& savedMessage.error? savedMessage.error.code : 401;
    return { error: { code, message} };
  } else {
    console.log("------------ Step 4");
    // Message saved, send back Ok response
    return { status: 'Ok', message: 'message was sent' };
  }
};

const receive = async ({username: receiver}) => {
  const messages = await Message.forge({ receiver}).fetchAll()
    .catch(err => {
      log(red(`Error retrieving received messages for ${receiver} cause: `, err.stack));
      const msge = err.message || 'Error retrieving messages';
      return { error: { code: 401, message: msge } };
    });

  if (typeof messages === 'undefined' || messages.length === 0) {
    // Message not saved, send back error
    const msge = `No message found for user ${receiver}`;
    return { error: { status: 'Ok', qtty: messages.length, messages: [] } };
  } else {
    // Message saved, send back Ok response
    return { status: 'Ok', qtty: messages.length, messages };
  }

};

module.exports = {
  send,
  receive,
}
