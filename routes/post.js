const express= require('express');
const router = express.Router();
const Post = require('../models/post');
const Postid = require('../models/post');
const mongoose=require('mongoose');
const multer= require('multer');
const lien = "http://localhost:8080/post/";
const teturl="http://localhost:8080/";
const date = require('date-and-time');

router.use('/upload', express.static('upload'));

let datepost = date.format(new Date(), 'YY-MM-DD HH-mm-ss SSS');
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './upload/');
    },
    filename: function (req, file, cb){
        datepost = date.format(new Date(), 'YY-MM-DD HH-mm-ss SSS');
       cb(null, datepost+file.originalname);
    }
});



const upload = multer({storage: storage});


//ajouter un post
router.post('/nouvMessage', upload.single("postmedia"), (req, res, next)=>{
datepost = date.format(new Date(), 'YY-MM-DD HH-mm-ss SSS');
   let chemin="";
   let mediatype="false";
    if(req.file===undefined){
        chemin=false;
   }else{
       mediatype=req.file.mimetype;
    chemin=req.file.path;
   }
    const post = new Post({
        _id : new mongoose.Types.ObjectId,
        titre : req.body.titre,
        message :req.body.message,
        nom : req.body.nom,
        date: datepost,
        mediatype: mediatype,
        media : chemin 
    });
    post.save()
    .then( ()=>{
        res.redirect('/ajouter')
    })
    .catch(err=> console.log(err));
    
}); 


//rechercher un post
router.get("/:postid", (req, res, next)=>{
    let info;
    const id = req.params.postid;
    Post.findById(id)
    .select('nom titre message media _id')
    .exec()
    .then( doc => {
        Postid.find()
        .select('titre nom message media _id')
        .exec()
        .then( docs=>{
            res.render('pages/publications',{info:docs});
        });
    })
    .catch(err => {
        res.status(500).json({
            error :"Mauvais id"
        });
    });
});


//rechercher tout les post
const getpost= (res)=>{
    Post.find()
    .select('titre nom message media')
    .exec()
    .then( docs=>{
        res.status(200).json({
            nombre: docs.length,
            post : docs.map(doc =>{
                return{
                    _id:doc._id,
                    name : doc.nom,
                    message:doc.message,
                    mediatype: doc.mediatype,
                    mediamethode:"GET",
                    medialen: teturl+doc.media,
                    request:{
                        methode:"GET",
                        url:lien+doc._id
                    }
                }
            })
        });
    })
    .catch( err=>{
        console.log(err);
        res.status(500);
    });
};

//modifier un post
router.patch("/:productId",(req, res, next)=>{
    const id=req.params.productId;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Post.updateOne({_id:id}, {$set : updateOps})
    .exec()
    .then(result => { 
        res.status(200).json(result);
    }) 
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
    
});

//suprimer un  post
router.delete('/:postId', (req, res, next)=>{
    const id=req.params.postId;
    Post.deleteOne({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

//suprimer toutes les posts
router.delete('/', (req, res, next)=>{
    const id=req.params.postId;
    Post.deleteMany()
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});



module.exports=router;
