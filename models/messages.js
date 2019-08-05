const mongoose= require('mongoose');

const messageSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom : String,
    message : String,
    mail : String,
    telephone: String,
    date: String,
});

module.exports = mongoose.model('Messages', messageSchema);