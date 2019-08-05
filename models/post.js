const mongoose= require('mongoose');

const postSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    titre : String,
    message : String,
    nom : String,
    date: String,
    mediatype: String,
    media : String
});

module.exports = mongoose.model('Post', postSchema);