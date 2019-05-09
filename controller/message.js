const Message = require('../model/message');
const log = require('debug')('chat-api:controller:message');
const { red, green, yellow } = require('chalk');

const send = async (message) => {
  const msg = new Message({ ...message });
  const savedMessage = await msg.save()
    .catch(err => {
      log(red('Error saving message:', err));
      const msge = err.message || 'Error saving message';
      return { error: { code: 401, message: msge } };
    });

  if (typeof savedMessage === 'undefined') {
    // Message not saved, send back error
    const msge = 'Error saving message';
    return { error: { code: 401, message: msge } };
  } else {
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
