const Message = require('../model/message');
const log = require('debug')('chat-api:controller:message');
const { red, green, yellow } = require('chalk');

const send = async (message) => {
  const msg = new Message({ ...message });
  const savedMessage = await msg.save()
    .catch(err => {
      log(red('Error saving message:', err));
      const msge = err.message || 'Error saving message';
      return {error: {code: 401, message: msge}};
    });

  if (typeof savedMessage === 'undefined') {
    // Message not saved, send back error
    const msge = 'Error saving message';
    return {error: {code: 401, message: msge}};
  } else {
    // Message saved, send back Ok response
    return {status: 'Ok', message: 'message was sent'};
  }

};

const receive = async (message) => {
  const msg = new Message({ ...message });
  const savedMessage = await msg.save()
    .catch(err => {
      log(red('Error saving message:', err));
      const msge = err.message || 'Error saving message';
      return {error: {code: 401, message: msge}};
    });

  if (typeof savedMessage === 'undefined') {
    // Message not saved, send back error
    const msge = 'Error saving message';
    return {error: {code: 401, message: msge}};
  } else {
    // Message saved, send back Ok response
    return {status: 'Ok', message: 'message was sent'};
  }

};

module.exports = {
  send,
  receive,
}
