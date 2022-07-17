const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const express = require('express');
const router = express.Router();


router.get('/status', (req, res, next) => {
    res.status(200);
    res.json({ 'status': 'ok' });

    router.post('/login', asyncMiddleware(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).json({ 'message': 'unauthenticated' });
            return;
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            res.status(401).json({ 'message': 'unauthenticated' });
            return;
        }
        res.status(200).json({ 'status': 'ok' });
    }));

    router.post('/logout', (req, res, next) => {
        res.status(200);
        res.json({ 'status': 'ok' });
    });
    router.post('/token', (req, res, next) => {
        res.status(200);
        res.json({ 'status': 'ok' });
    });
    router.post('/signup', asyncMiddleware( async (req, res, next) => {
        const { name, email, password } = req.body;
        await UserModel.create({ email, password, name });
        res.status(200).json({ 'status': 'ok' });
    }));
});
module.exports = router;

//In the code above, we created a new express.Router, which is a complete middleware and routing system that acts like a mini express app that we can import into our main app.

//We imported the UserModel that we just created, and then we imported a new middleware called asyncMiddleware. We will create this middleware next.
// Then, in the signup route we wrapped our function in the new asyncMiddleware we just imported. The reason we did this is that we are going to use async/await in our function, however, to ensure we catch any uncaught errors in our function we would normally wrap our logic in a try/catch statement. However, by using the asyncMiddleware we can write our logic without the try/catch and let the middleware catch any uncaught errors.
// In the function that is called when the signup route is visited, we pull the name, email, and password fields from the request body and then we pass these arguments to the create method of our UserModel. By calling the create method on our model, mongoose will trigger the save pre-hook we set up, and once that is complete mongoose will attempt to add the new document to the database.
// Lastly, we respond with the 200 status code.


