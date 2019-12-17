var express=require('express');
var app= express();

var bodyParser=require('body-parser');

const PORT=4001;

var messages=require('./chat-service');
var gamer= require('./gamer-service');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
     // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
})

var router=express.Router();    

router.get('/',messages.hello_world);

router.get('/message',messages.get_all_messages);

router.post('/message',messages.get_message);
router.put('/message',messages.add_message);
router.delete('/message',messages.delete_message);


router.get('/gamer/scores',gamer.scores);

router.get('/gamer/scores/:userId',gamer.get_score);
router.put('/gamer/scores',gamer.add_score);


router.put('/gamer/users',gamer.register);
router.get('/gamer/users/:userId',gamer.getUserInfo);
router.post('/gamer/users',gamer.logIn);
router.get('/gamer/users',gamer.getUsers);

router.get('/gamer/memory/cards',gamer.getCards);

// router.get('/pizzas',(req,res)=>{  });


app.use('/api',router);
app.listen(process.env.PORT || PORT,()=>{
    console.log(`Server started on port ${PORT} or ${process.env.PORT}`);
})