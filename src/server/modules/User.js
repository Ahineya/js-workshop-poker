var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date,
    coins: Number
});