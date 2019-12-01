var express=require('express');
var app= express();
var bodyParser=require('body-parser');

const PORT=4001;

var todo=require('./todo');

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

router.get('/',todo.hello_world);

router.get('/todo',todo.list_all_todo);

router.post('/todo',todo.get_todo);
router.put('/todo',todo.add_todo);
router.delete('/todo',todo.delete_todo);


// router.get('/pizzas',(req,res)=>{  });


app.use('/api',router);

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})