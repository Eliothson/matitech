const express= require('express');
const router = express.Router();
const Utilisateur= require('../models/utilisateur')
const Post =require ('../models/post')
const date = require('date-and-time');
const mongoose=require('mongoose');
const lien = "http://localhost:8080/utilisateurs/";

const nodemailer=require('nodemailer');

let now = new Date();
let datepost = date.format(now, 'YY-MM-DD HH-mm-ss SSS');

//enregistrement d'un utilisateur
router.post('/enregistrer', (req, res, next)=>{

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: 'matitechhaiti@gmail.com',
        pass: 'bettyson11B'
      },
      tls:{
          rejectUnauthorized: false
      }
    });
    
    let mailOptions = {
      from: 'matitechhaiti@gmail.com',
      to: req.body.mail,
      subject: 'Remerciement',
      text: 'Merci pour votre souscription! a notre Site \n vous recevrez nos infos sur chaque publications'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
    });

    let datepost = date.format(now, 'YY-MM-DD HH-mm-ss SSS');
    
    const uti = new Utilisateur({
        _id : new mongoose.Types.ObjectId,
        mail: req.body.mail,
        date: datepost
    });
    uti.save()
    .then( ()=>{
        res.redirect('/');


    })
    .catch(err=> console.log(err));
});

//rechercher un post
router.get("/:postid", (req, res, next)=>{
    const id = req.params.postid;
    Utilisateur.findById(id)
    .select('mail _id')
    .exec()
    .then( doc => {
        if(doc){
            res.status(201).json({
                id: doc._id,
                mail: doc.mail,
                request :{
                    methode: "Get",
                    url: lien+id
                }
            });
        }else{
            res.status(404).json({
                message : "pas de post pour cet id"
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error :"Mauvais id"
        });
    });
});

//rechercher tout les utilisateurs
router.get("/",(req,res,next)=>{

    Utilisateur.find()
    .select('mail _id')
    .exec()
    .then( docs=>{
        res.status(200).json({
            nombre: docs.length,
            Utilisateurs : docs.map(doc =>{
                return{
                    _id:doc._id,
                    mail : doc.mail,
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
});

//modifier un utilisateur
router.patch("/:utiId",(req, res, next)=>{
    const id=req.params.utiId;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Utilisateur.updateOne({_id:id}, {$set : updateOps})
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

//suprimer un  utilisateur
router.delete('/:postId', (req, res, next)=>{
    const id=req.params.postId;
    Utilisateur.deleteOne({_id:id})
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

//supprimer tous les utilisateurs
router.delete('/', (req, res, next)=>{
    const id=req.params.postId;
    Utilisateur.deleteMany()
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
