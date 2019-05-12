
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

}
