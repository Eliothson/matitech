const Post = require('../models/post');

function getpost (){
    Post.find()
    .select('titre nom message media')
    .exec()
    .then( docs=>{
        return docs;
    })
    .catch( err=>{
        console.log(err);
        res.status(500);
    });
}

module.exports=getpost;