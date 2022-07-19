/**
 * Authentication
 *
 * Now that the score endpoints are connected to our database, we will now start working on adding authentication to our server.
 * For the authentication, we will be using passport.js along with passport-jwt.
 * Passport is an authentication middleware for Nodejs that can easily be used with Express, and it supports many different types of authentication.
 * Along with passport, we will be using JSON web tokens for validating users.
 * In addition to using a JWT for authenticating users, we will also be using a refresh token to allow a user to update their main JWT.
 * The reason we are doing this is that we want the main JWT to be short-lived, and instead of requiring the player to have to keep re-logging in to get a new token,
 * they can instead use their refresh token to update the main JWT, since it will be long-lived.
 */

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const UserModel = require('../models/userModel');
// handle user registration
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { name } = req.body;
        const user = await UserModel.create({ email, password, name});
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));


/**
 * In the code above, we did the following:
 *
 *     First, we imported the passport, passport-local, and passport-jwt. Then, we imported the userModel.
 *     Next, we configured passport to use a new local strategy when the signup route is called. The localStrategy takes two arguments: an options object and a callback function.
 * For the options object, we set the usernameField and passwordField fields. By default, if these fields are not provided passport-local will expect the username and password fields, and if we want to use a different combination we need to provide them.
 *     Also, in the options object, we set the passReqToCallback field and we set it to true. By setting this field to true, the request object will be passed to the callback function.
 * Then, in the callback function, we took the logic for creating the user that was in the signup route and we placed it here.
 *     Lastly, we called the done function that was passed as an argument to the callback function.
 *
 */


// handle user login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));
// verify token is valid
passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: function (req) {
        let token = null;
        if (req && req.cookies) token = req.cookies['jwt'];
        return token;
    }
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));


/**
 * We set up another local strategy for the login route. Then in the callback function, we took the logic for logging a user in from the login route and we placed it here.
 *     Next, we configured passport to use a new JWT strategy. For the JWT strategy, we provided two arguments: an options object and a callback function.
 * In the options object, we provided two fields: secretOrKey and jwtFromRequest.
 *     secretOrKey is used for signing the JWT that is created. For this tutorial, we used a placeholder secret and normally you would want to pull this from your environment variables or use some other secure method, and you would want to use a much more secure secret.
 *     jwtFromRequest is a function that is used for getting the jwt from the request object. For this tutorial, we will be placing the jwt in a cookie, so in the function, we pull the jwt token from the request object cookie if it exists otherwise we return null.
 *     Lastly, in the callback function, we call the done function that was provided to the callback.
 */


