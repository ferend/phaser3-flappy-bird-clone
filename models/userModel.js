const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type: String,
        required: true
    },
    highScore : {
        type: Number,
        default: 0
    }
});
UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;


// First, we imported the mongoose and bcrypt packages. bcrypt is a helper library for hashing passwords.
//     Next, we created a new mongoose Schema object which allows us to define the fields we want our model to have and in each of these fields we can specify their type, if they are required, and provide default values. By creating and using a Schema object, it will provide us built-in typecasting and validation. For example, if we’re to pass "12" instead of 12 for the high score, mongoose will automatically cast that string into a number.
//     Then, we created a pre-save hook that will be called before a document is saved in MongoDB. When this hook is triggered, we get a reference to the current document that is about to be saved, and then we used bcrypt to hash that users password. Finally, we call the callback function that passed as an argument to our hook.
//     Next, we created a new method called isValidPassword that will be used for validating that the user’s password is correct when they try to log in.
// Lastly, we created our model by calling mongoose.model and we passed this method two arguments: the name of our model and the schema that will be used for the model. Then, we exported the UserModel.
//

