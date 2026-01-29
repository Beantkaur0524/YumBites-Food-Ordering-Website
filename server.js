var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
const cors=require("cors");
const path=require("path");
const multer=require('multer');

var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var port     = process.env.PORT || 8888;
const autoIncrement = require('mongoose-auto-increment');
app.use(cors());

app.use('/assets',express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended':'true' }));
var Register = require('./models/Register');
var Product = require('./models/Product');
var Cart = require('./models/Cart');
// connect to mongoDB database
mongoose.connect(database.url);
console.log(database.url);
//multer
var imagename='';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        console.log(file);

   imagename=Date.now() + path.extname(file.originalname)+'';
console.log(imagename);
        cb(null, imagename);
    }
});

const upload = multer({ storage: storage});

//get all product data from db
app.get('/', function(req, res) {
	Product.find().then((data) => {
	  console.log(data);
	  console.log("home api");
	res.json(data);
	});
   //console.log("home api");
   });

//Register
app.post('/adduser', upload.single('file'), function(req, res) {
	// create mongose method to create a new record into collection
	console.log(req.body);
	   Register.create({
		name:req.body.name,
		password : req.body.password,
		email : req.body.email,
		type: req.body.type,
		mobile: req.body.mobile,
		address: req.body.address,
		city: req.body.city,
		profileImg:imagename
		});
	});

//login
app.post('/login', async (req, res) => {
	try{
	const { email, password } = req.body;
  console.log(email);
  let query = {"email": email, "password": password}
  // console.log(query)
	

	const user = await Register.find(query);
  console.log(user);
	if (user) {
	  res.json([user]);
	} else {
	  res.json([]);
	}
} catch(err) {
	res.send(err);
}
  });

//add items
app.post('/additem', upload.single('file') ,function(req, res) {
  // create mongose method to create a new record into collection
  console.log(req.body);
      Product.create({
      name:req.body.name,
      price : req.body.price,
      desc : req.body.desc,
      category: req.body.category,
      itemImg: imagename,
      R_id: req.body.R_id
    });
    /*res.json("Item added :)");*/
    // res.redirect("/");
  });



  //get all product data from db of any particular provider
app.get('/provider/:u_id', async function(req, res) {
  try{
    let id = req.params.u_id;
    console.log("find"+id);
    var query = { R_id : id};
    let product = await Product.find(query);
    console.log(product);
    res.json(product);
  }catch(err){
    res.send(err);
  }
});


  //find particular product
  app.get('/product_find/:id', async function(req, res) {
    try{
    let id = req.params.id;
    console.log("find"+id);
    var query = { id : id};
    let product = await Product.find(query);
    console.log(product);
    res.json(product);
    console.log(product[0].name);
  }catch(err){
    res.send(err);
  }
  
  });

  // update a product by id
  app.post('/product_update/:u_id', upload.single('file') ,async function(req, res) {
    // create mongose method to update a existing record into collection
    try{
      // console.log("update"+ req.params.id);
      // let id = req.params.id;
      let u_id = req.params.u_id;
      let id=req.body.id;
      var data = {$set:{
        id : req.body.id,
        name : req.body.name,
        price : req.body.price,
        desc : req.body.desc,
        category: req.body.category,
        itemImg: imagename
      }}
      console.log("hi");
      console.log(data);
      var query = { id : id};
      await Product.updateOne(query,data);
      res.redirect(`/provider/${u_id}`);
    }catch(err){
      res.send(err);
    }
      
  });


  app.get('/product_delete/:u_id/:p_id', async function(req, res) {
    let u_id = req.params.u_id;
    try{
    console.log(req.params.p_id);
    let u_id = req.params.u_id;
    let id = req.params.p_id;
    await Product.deleteOne({
      id : id
    });
    
  }catch(err){
    res.send(err);
  }
  

  res.redirect(`/provider/${u_id}`);
  
  
  
  });
  //Admin routes

//get list of customers
app.get('/customerList', async function(req, res) {
  try{
    var query = { type : 'customer'};
    let cust = await Register.find(query);
    console.log(cust);
    res.json(cust);
  }catch(err){
    console.log(err);
    res.send(err);
  }
});

//get list of providers 
app.get('/providerList', async function(req, res) {
  try{
    var query = { type : 'provider'};
    let cust = await Register.find(query);
    console.log(cust);
    res.json(cust);
  }catch(err){
    console.log(err);
    res.send(err);
  }
});

//food items of particular provider
app.get('/pList/:id', async function(req, res) {
  try{
    let id = req.params.id;
    var query = { R_id : id};
    let cust = await Product.find(query);
    console.log(cust);
    res.json(cust);
  }catch(err){
    console.log(err);
    res.send(err);
  }
});


//delete customer
app.get('/delUser/:id',async function(req,res){
  try{
    let id = req.params.id;
    await Register.deleteOne({R_id:id});
    console.log("user deleted successfully");
    res.redirect('/customerList');
  }catch(err){
    console.log(err);
    res.send(err);
  }
})


//cart 
//add to cart
app.post('/addcart', function(req, res) {
	// create mongose method to create a new record into collection
	console.log(req.body);
       Cart.create({
		id:req.body.id,
		name : req.body.name,
		price : req.body.price,
		itemImg:req.body.image
		});
//res.json("done");
console.log("added to cart");
});

//fetch cart
app.get('/cart', function(req, res) {
  Cart.find().then((data) => {
    console.log(data);
    res.json(data);
    });
  console.log("cart api");
  });


//cart update
app.post('/update', function(req, res) {
  // create mongose method to create a new record into collection
  console.log('cart');
  console.log(req.body);
  var data = {$set:{
    qnty : req.body.qnty
  }}
  console.log(data);
  var query = { id : req.body.id};
  Cart.updateOne(query,data).then((data) => {
    console.log(data);
    res.json(data);
    });
  
});

//cart delete
app.get('/delcart/:id',async function(req,res){
  try{
    let id = req.params.id;
    await Cart.deleteOne({id:id});
    console.log("item deleted successfully");
    res.redirect('/cart');
  }catch(err){
    console.log(err);
    res.send(err);
  }
})


//logout
app.get('/logout',async function(req,res){
  try{
    Cart.drop();
    console.log("cart dropped");
  }catch(err){
    console.log(err);
    res.send(err);
  }
})


app.listen(port);
console.log("App listening on port : " + port);