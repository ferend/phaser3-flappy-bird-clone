const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');

const tokenList = {};
const router = express.Router();

router.get('/status', (req, res, next) => {
    res.status(200).json({ status: 'ok' });
});

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.status(200).json({ message: 'signup successful' });
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An Error occured');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const body = {
                    _id: user._id,
                    email: user.email
                };

                const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: 300 });
                const refreshToken = jwt.sign({ user: body }, 'top_secret_refresh', { expiresIn: 86400 });

                // store tokens in cookie
                res.cookie('jwt', token);
                res.cookie('refreshJwt', refreshToken);

                // store tokens in memory
                tokenList[refreshToken] = {
                    token,
                    refreshToken,
                    email: user.email,
                    _id: user._id
                };

                //Send back the token to the user
                return res.status(200).json({ token, refreshToken });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.post('/token', (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken in tokenList) {
        const body = { email: tokenList[refreshToken].email, _id: tokenList[refreshToken]._id };
        const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: 300 });

        // update jwt
        res.cookie('jwt', token);
        tokenList[refreshToken].token = token;

        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.post('/logout', (req, res) => {
    if (req.cookies) {
        const refreshToken = req.cookies['refreshJwt'];
        if (refreshToken in tokenList) delete tokenList[refreshToken]
        res.clearCookie('refreshJwt');
        res.clearCookie('jwt');
    }

    res.status(200).json({ message: 'logged out' });
});

module.exports = router;


/**
 * First, we imported jsonwebtoken and passport, and then we removed `userModel` and `asyncMiddleware`.
 * Next, in the signup route, we added the passport.authenticate middleware and set it to use the passport signup configuration we created. Since we moved all of the logic for creating the use to the auth.js file, the only thing we need to do in the callback function is to return a 200 response.
 * Then, in the login route we added the passport.authenticate middleware and set it to use the passport login configuration we created.
 * In the callback function, we first check to see if there was an error or if a user object was not returned from the passport middleware. If this check is true, then we create a new error and pass it to the next middleware.
 * If that check is false, we then call the login method that is exposed on the request object. This method is added by passport automatically. When we call this method, we pass the user object, an options object, and a callback function as arguments.
 * In the callback function, we create two JSON web tokens by using the `jsonwebtoken` library.  For the JWTs, we include the id and email of the user in the JWT payload, and we set the main token to expire in five minutes and the refreshToken to expire in one day.
 * Then, we stored both of these tokens in the response object by calling the cookie method, and we stored these tokens in memory so we can reference them later in the token refresh endpoint. Note: for this tutorial, we are storing these tokens in memory, but in practice, you would want to store this data in some type of persistent storage.
 * Lastly, we responded with a 200 response code and in the response, we send the token and refreshToken.
 * Next, in the token route, we pulled the email and refreshToken from the request body. We then checked to see if the refreshToken is in the tokenList object we are using for tracking the user’s tokens, and we made sure the provided email matches the one stored in memory.
 * If these do not match, or if the token is not in memory, then we respond with a 401 status code.
 * If they do match, then we create a new token and store it in memory and update the response cookie with the new token.
 * We then respond with a 200 response code and in the response, we send the new token.
 * Finally, in the logout route, we check to request object has any cookies.
 * If the request object does have any cookies, then we pull the `refreshJwt` from the cookie and delete it from our in-memory token list if it exists.
 * We then clear the jwt and refreshJwt cookies by calling the clearCookie method on the response object.
 * Lastly, we respond with a 200 response code.
 */


