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
        messg.receiver = [originalSender]; 
      } else {
        return relatedMsg && relatedMsg.error? relatedMsg.error: { error: { code: 401, message: 'Wrong relatedToMessage' } };
      }
  }
  const calls = messg.receiver.map(async (receiver) => {
    const msgToPersist = {...messg};
    msgToPersist.receiver = receiver;
    const msg = new Message(msgToPersist);
    const savedMessage = await msg.save()
      .catch(err => {
        log(red(`Error saving message to receiver: (${receiver}) result code: (${err.code}) - cause: `, err.message));
        const msge = err.code == 23503? 'Wrong relatedToMessage o receiver' : 'Error saving message';
        return { error: { code: 401, message: msge } };
      });  
    if (typeof savedMessage === 'undefined' || (savedMessage &&savedMessage.error)) {
      // Message not saved, sending back error
      const message = savedMessage&& savedMessage.error? savedMessage.error.message : `Error saving message to receiver: ${receiver}`;
      const code = savedMessage&& savedMessage.error? savedMessage.error.code : 401;
      return Promise.reject({ error: { code, message} });
    } else {
      // Message saved, sending back Ok response
      return Promise.resolve({ status: 'Ok', message: `message sent to receiver ${receiver}` });
    }   
  });

  return await Promise.all(calls).then( (results) => {
    //log(green(`Result of saving message sent by ${messg.sender}: `, JSON.stringify(results, null, 2)));
    return {status: 'Ok', results};
  } )
  .catch(reason => { 
    log(green(JSON.stringify(reason, null, 2)));
    return {error: reason};
  });
  
};

const update = async (msg) => {
  const {id, readed, relatedToMessage, message, sender, receiver} = msg;
  //TODO add more update options
  const updated = await Message.forge().save({id, readed, relatedToMessage, message, sender, receiver}, {patch: true})
    .catch(err => {
      log(red(`Error code: (${err.code}) updating message sender: `, err.message));
      const msge =`Error updating message: ` + id;
      return { error: { code: 401, message: msge } };
    });

  if(updated && !updated.error){
    const updatedMessage = updated.attributes;
    log(green(`Successfuly updated message: ${id} result:` , JSON.stringify(updatedMessage, null, 2)));
    return Promise.resolve({ status: 'Ok', message: `message successfuly updated` });
  } else {
    return Promise.resolve(updated && updated.error
      ? updated.error : 
      { error: { code: 401, message: 'Error Updating message' } }
    );
  }
  
};

const receive = async ({username:receiver}) => {
  log(green('Starting receive with receiver: ', receiver));
  const messages = await Message.where({receiver, readed: false}).fetchAll()
    .catch(err => {
      log(red(`Error retrieving received messages for ${username} cause: `, err.stack));
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
  update
}
