const express= require('express');
const router = express.Router();
const path= require('path');
let data=require('./models/datasite');
const Post = require('./models/post');
const Post2 = require('./models/post');
const lien = "http://localhost:8080/post/";
const teturl="http://localhost:8080/";

router.use(express.static(path.join(__dirname, "views")));
  router.get('/', (request,response)=>{
    Post.find()
    .select('titre nom message media mediatype date')
    .exec()
    .then( docs=>{
      const info =docs;
      
      response.render('pages/index', {info:info})
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });
  });


  router.get('/index', (request,response)=>{
    Post.find()
    .select('titre nom message media mediatype date')
    .exec()
    .then( docs=>{
      const info =docs;
      
      response.render('pages/index', {info:info})
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });  });

  router.get('/service', (request,response)=>{
      response.render('pages/service')
  });

  router.get('/publications', (request,response)=>{
    console.log(request.body.idpost);

    Post.find()
    .select('titre nom message media mediatype date')
    .exec()
    .then( docs=>{
      const info =docs;
      
      response.render('pages/publications',{info:info});
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });
  });

  router.post('/publications', (request,response)=>{
    console.log(request.body.idpost);

    Post.find()
    .select('titre nom message media mediatype date')
    .exec()
    .then( docs=>{
      const info =docs;
      Post2.findById(request.body.idpost).select('titre nom message media mediatype date')
      .exec()
      .then(doc=>{
          response.render('pages/publications',{info:info, doc:doc});
      }).catch();
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });
  });




  router.get('/communaute', (request,response)=>{
    response.render('pages/communaute')
  });

  router.get('/apropos', (request,response)=>{
      response.render('pages/apropos')
  });

  router.get('/contact', (request,response)=>{
    response.render('pages/contact')
  });

  router.get('/ajouter', (request,response)=>{
    response.render('pages/ajouter')
  });

  router.get('/fondateur', (request,response)=>{
    response.render('pages/fondateur')
  });

  router.post('/ajouter/:message', (request,response)=>{
    console.log(request);
  });
  


module.exports=router;