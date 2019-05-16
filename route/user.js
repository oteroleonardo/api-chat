
const { hasAccess, handleUnauthorized, User, passport } = require('../passport');
const log = require('debug')('chat-api:route:user');
const { red, green, yellow } = require('chalk');
const user = require('../controller/user');
module.exports = (router, catchAsyncErrors) => {

  router.get('/contacts',
    hasAccess,
    catchAsyncErrors(async (req, res) => {
      const { users } = await user.contacts();
      if (users) {
        log(green("Contacts successfully retrieved"));
        return res.json({ users });
      } else {
        log(yellow("Contacts not found"));
        return res.json({ users: [] });
      }

    }),
    handleUnauthorized
  );
  router.patch('/user',
    hasAccess,
    catchAsyncErrors(async (req, res) => {
      const {username, status, email, password} = req.body;
      const storedUsr = req.user.attributes;
      storedUsr.username = username || storedUsr.username;
      storedUsr.status = status || storedUsr.status;
      storedUsr.email = email || storedUsr.email;
      if(password) {
        storedUsr.password = password;
      }
      
      const result  = await user.update(storedUsr);
      if (result && !result.error) {
        log(green("User state changed"));
        return res.json(result);
      } else {
        log(yellow('Error updating user'));
        return res.json({ status: 'Fail', message: result&&result.error? result.error.message :'User state not changed' });
      }

    }),
    handleUnauthorized
  );

}
