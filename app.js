// reads in our .env file and makes those values available as environment variables
require('dotenv').config();
const express = require('express');
const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri);
mongoose.connection.on('error', (error) => {
    console.log(error);
    process.exit(1);
});
mongoose.connection.on('connected', function () {
    console.log('connected to mongo');
});

// create an instance of an express app
const app = express();
// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// main routes
app.use('/', routes);
app.use('/', secureRoutes);
// catch all other routes
app.use((req, res, next) => {
    res.status(404);
    res.json({ message: '404 - Not Found' });
});
// handle errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error : err });
});
// have the server start listening on the provided port
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});

////In the code above, we did the following:
//
//     We required dotenv, which will read in our .env file and make those values available as environment variables. It is recommended that you call this method as early as you can in your app.
//     Next, we loaded in the rest of the modules that we will need for our app.
//     We then created our express app instance, and we told the app to use the bodyParser module we loaded. By telling the app to use the bodyParser module, it will allow us to parse incoming POST body payloads.
//     Next, we created a GET /status endpoint for our server to listen on and when this endpoint is called the server will return a 200 response.
//         To create a route, we first need to tell express which HTTP method is supported for this route and we do this by calling the appropriate method on app, for example, getor post.
//         Then, in the method call, we pass two arguments, the first is the route that we want to make available, /status in this example, and the second argument is the callback function that will be invoked when a call is made to this route.
//         This callback function will receive three arguments when it is called:
//             req – The request object which will contain all of the metadata for the request. Some of this data includes headers, body, query string parameters, etc.
//             res – The response object that is returned to the caller. This object allows us to set the status code, the type of response, and the payload that is returned.
//             next – Can be used to call the next middleware in the chain if we are not done processing the request.
//     We then created two middleware handlers for our express app: an error handler and a 404 handler.
//         The error handler middleware is unique because this middleware will receive four arguments instead of three, and this new argument is the error that was sent.
//         The 404 handler middleware will be invoked last if no other middleware has returned a response. The middleware acts as a catch-all if the user tries to call any routes we have not explicitly defined.
//     Finally, we told our server to start listening on port 3000, or if a PORT environment variable is set the app will use that one.
