const express= require('express');
const router = express.Router();
const Messages= require('../models/messages')
const date = require('date-and-time');
const mongoose=require('mongoose');
const lien = "http://localhost:8080/messages/";
const teturl="http://localhost:8080/";
const nodemailer=require('nodemailer');

let now = new Date();
let datepost = date.format(now, 'YY-MM-DD HH-mm-ss SSS');

//enregistrement d'un message
router.post('/', (req, res, next)=>{
    console.log(req.body.mail);

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
        text: " L'equipe de MatiTech a recu votre message."
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        }
      });


    let datepost = date.format(now, 'YY-MM-DD HH-mm-ss SSS');
    const Mes = new Messages({
        _id : new mongoose.Types.ObjectId,
        nom: req.body.nom,
        message: req.body.message,
        mail: req.body.mail,
        telephone: req.body.telephone,
        date: datepost
    });
    Mes.save()
    .then( ()=>{
        res.redirect('/');
    })
    .catch(err=> console.log(err));
});

//rechercher un messages
router.get("/:messageId", (req, res, next)=>{
    const id = req.params.messageId;
    Messages.findById(id)
    .select('messages mail telephpne nom _id date')
    .exec()
    .then( doc => {
        if(doc){
            res.status(201).json({
                id: doc._id,
                mail: doc.mail,
                message: doc.message,
                nom: doc.nom,
                telephone : doc.telephone,
                date: doc.date,
                request :{
                    methode: "Get",
                    url: lien+id
                }
            });
        }else{
            res.status(404).json({
                message : "pas de message pour cet id"
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error :"Mauvais id"
        });
    });
});

//rechercher tout les messages
router.get("/",(req,res,next)=>{
    Messages.find()
    .exec()
    .then( docs=>{
        res.status(200).json({
            nombre: docs.length,
            Messages : docs.map(doc =>{
                return{
                    id: doc._id,
                    mail: doc.mail,
                    message: doc.message,
                    nom: doc.nom,
                    telephone :doc.telephone,
                    date: doc.date,
                    request :{
                        methode: "Get",
                        url: lien+doc._id
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

//modifier un messages
router.patch("/:messagesId",(req, res, next)=>{
    const id=req.params.messagesId;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Messages.updateOne({_id:id}, {$set : updateOps})
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
router.delete('/:messagesId', (req, res, next)=>{
    const id=req.params.messagesId;
    Messages.deleteOne({_id:id})
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
    Messages.deleteMany()
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
