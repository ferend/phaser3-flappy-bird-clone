const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const router = express.Router();
router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
    const { email, score } = req.body;
    await UserModel.updateOne({ email }, { highScore: score });
    res.status(200).json({ status: 'ok' });
}));
router.get('/scores', asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
    res.status(200).json(users);
}));
module.exports = router;


/**
 * We imported asyncMiddleware and UserModel, and then we wrapped both of the routes in the asyncMiddleware middleware we created in part two.
 *     Next, in the submit-score route, we grabbed the email and score values from the request body. We then used the updateOne method on the UserModel to update a single document in the database where the provided email value matches the email property on the record.
 *     Then, in the /scores route, we used the find method on the UserModel to search for documents in the database.
 *
 *     The find method takes two arguments, the first is an object that is used for limiting the documents that are returned from the database. By leaving this as an empty object, all documents will be returned from the database.
 *     The second argument is a string that allows us to control which fields we want to be returned on the results that are returned to us. This argument is optional, and if it is not provided then all fields will be returned. By default, the _id field will always be returned, so to exclude it we need to use -_id in this argument.
 *
 *     We then called the sort method to sort the results that are returned. This method allows you to specify the field you would like to sort by, and by setting that value to -1 the results will be sorted in descending order.
 *     Finally, we called the limit method to make sure we return 10 documents at max
 */
