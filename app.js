const express= require('express');
const app= express();
const morgan = require('morgan');
const bodyparser=require('body-parser');
const mongosse= require('mongoose');

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Origin",
    "Origin, X-Requested-With, Content-Type, Accept, Authorizatio"
    );
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE,PATH,GET ');
        return res.status(200).json({});
    }
    next(); 
});

const postRoutes=require('./routes/post');
const pagesRoutes=require('./gestionpage');
const utilisateursRoutes = require('./routes/utilisateurs');
const messagesRoutes = require('./routes/messages');
const methode_index=require('./methodes_index');

//const config=require('./confidb');
//mongosse.connect("mongodb://localhost:27017/MatitechDatabase", {useNewUrlParser : true});
mongosse.connect('mongodb+srv://eliothson:bettyson11B.@matitechdatabase-mhesn.mongodb.net/test?retryWrites=true',{
useNewUrlParser: true
});

mongosse.Promise = global.Promise;

// routes des Ulr 
app.use(morgan('dev'));

//les parsseurs pour les urls
app.use('/upload', express.static('upload'));
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());


app.set('view engine', 'ejs');
app.use('/messages', messagesRoutes);
app.use('/utilisateurs', utilisateursRoutes);
app.use('/', pagesRoutes);
app.use('/post', postRoutes);
app.use('/methodes_index', methode_index);
//app.use('/publications/:id',publications);

//gestion des erreus dans les urls
app.use((req, res, next)=>{
    const error = new Error('Page Non trouvee');
    error.status=404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

//exportations de l'objet app
module.exports=app;