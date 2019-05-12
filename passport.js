const log = require('debug')('chat-api:passport');
const {red, green, yellow, white} = require('chalk'); 
const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('./model/user');
const strategyJwt = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

log(white(`Passport initialized with jwt token expiration of ${process.env.TOKEN_EXPIRATION} sec.`));

// Passport initialization
const opts = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY,
  passReqToCallback: true,
};

const strategy = new strategyJwt(opts, (req, payload, next) => {
  req.tokenPayload = payload;
  const cb = async () => {
    log(green('Token payload: '), JSON.stringify(payload, null, 2));
    
    // const expirationDate = new Date(payload.exp * 1000);
    // if(expirationDate < new Date()) {
    //   log(red('Token expired for user id:', payload.id), red(err));
    //   next(null, false, {error:{code:401, message: 'Token expired'}});
    //   return;
    // } 

    const user = await User.forge({ id: payload.id }).fetch()
      .catch(err => {
        log(red('Error validating user id:', payload.id), red(err));
        res.json({error:{code:501, message: 'Error while checking user authentication'}})
        next(null, user, {error:{code: 401 , message: err.message}});
      });
    next(null, user, {error:{code:401, message: 'Unauthorized'}});
  };  
  cb();
});

passport.use(strategy);

module.exports = {
  passport,
  hasAccess: passport.authenticate('jwt', { session: false, failWithError: true }), 
  
  // (req, res, next) => {
  //   log(green('Token: '), req.headers.authorization);
  //   if (req.isAuthenticated()){
  //     log(white('User is auhtorized'));
  //     return next();
  //   }
  //   log(yellow('User is not auhtorized'));

  //   res.json({error: {code: 404, message: 'Access Not Authorized'}});
  //   return false;
  // },
  handleUnauthorized: (err, req, res, next) => {
    const message = err.message || "Authentication error";
    log(yellow(err));
    return res.json({ error: {cause: 401, message}});
  },
  User, 
}
