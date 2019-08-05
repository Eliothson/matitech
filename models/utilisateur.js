const mongoose = require('mongoose');

const utilisateurSchema= mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    mail: String,
    date: String
});

module.exports=mongoose.model('Utilisateur',utilisateurSchema );
