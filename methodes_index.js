const express= require('express');
const router = express.Router();
const lien = "http://localhost:8080/post/";
const teturl="http://localhost:8080/";
const date = require('date-and-time');
const fetch=require ('node-fetch');



router.post('/', (req, res, next)=>{
    console.log(req.body.mail);
    fetch('http://localhost:8080/utilisateurs/enregistrer', {
        method: 'post',
        body:  req.body.mail,
        headers: { 'Content-Type': 'application/json' }
    })
    .then( 
        res.redirect('index')
    );
});


module.exports=router;