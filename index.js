require('dotenv').config();
var portal = 3000;
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const datemod = require(__dirname+'/date.js');
const app = express();

const findOrCreate = require('mongoose-findorcreate');


app.set('view port', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


var searched = '';
var email_address = '';
let year = datemod.year();

// express-session.
app.use(session({
    secret: "Our little stuff.",
    resave: false,
    saveUninitialized: false
}));

// making passport to use express-session
app.use(passport.initialize());
app.use(passport.session());


// mongoose connection
// database connection
const admin = process.env.ADMIN_PASSWORD;
const uri = "mongodb+srv://admin-isaac:"+admin+"@cluster0.rfa5zq9.mongodb.net/product";
const connection = mongoose.connect(uri);

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleid : String,
});

const productSchema = mongoose.Schema({
    url : String,
    title : {
        type: String,
        required: true,
    },
    asin: String,
    price : {type: String, required:true },
    brand : String,
    product_details: {type: String, required: true},
    breadcrumbs : String,
    images_list : Array,
    asin: String,
    features: String,
})

// use the passport-mongoose to both authenticate and add users plugin.
userSchema.plugin(passportLocalMongoose); 
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
const product = mongoose.model('Product', productSchema);

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user, err) {
        done(err, user);
    }) 
});



app.get('/', function homepage(req, res) {
    res.render('index.ejs', {currentdate:datemod.date(), year:year});
})


app.post('/', function homepage(req, res) {
    searched = req.body.item_searched;
    // res.redirect('/search/'+searched);
    res.redirect('/search/'+searched);
    // when we work on the database, we need to redirect and add the searched item to the link.
})

// Login route
app.get('/login', function(req, res) {
    res.render('login.ejs', {currentdate:datemod.date(), year:year, messages:''});
});


app.post("/login", function(req, res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    req.login(user, function(err){
        if (err) {
        console.log(err);
        } else {
        passport.authenticate('local', {failureRedirect:'/login/error'}) (req, res, function(){
            if (req.user.id === process.env.ADMIN){
                res.redirect('/admin');
            }else{
            res.redirect("/store");
            }
        });
        };
    });
    });  

app.get('/login/error',function(req, res){
    if (!req.isAuthenticated) {
    res.render('login.ejs', {currentdate:datemod.date(), year:year, messages: 'error logging in, please check your email address and your password'});
    }else {
        res.redirect('/logout');
    }
})

app.get('/logout', function(req, res) {
    req.logout(function(err) {
        console.log(err);
    });
    res.redirect('/')
})

// admin route should be able to add new products to the database
app.get('/admin', function(req, res) {
    if (!req.isAuthenticated()){
        res.render('error.ejs');
    }
    else{
        if(req.user.id === process.env.ADMIN){
            res.render('admin.ejs')
        }else{
            res.redirect('/');
        }
    }

})

app.post('/admin/newItem', function(req, res){
    var itemname = req.body.itemname;
    var url = req.body.url;
    var price = req.body.price;
    var image = [req.body.image];
    var description = req.body.description;
    let newproduct = new product({
        url : url,
        title: itemname,
        price: price,
        images_list: image,
        product_details: description
    });
    newproduct.save().catch(function(err) {
       if (err){
        res.redirect('/admin');
       }else{
        res.redirect('/store');
       }
    });
    
});

// Register
app.get('/register', function(req, res) {
    res.render('register.ejs', {currentdate:datemod.date(), year:year});
});

app.post('/register', function(req, res) {
    if(req.body.password === req.body.repassword){
        User.register({username:req.body.username}, req.body.password, function(err){
            if (err){
                console.log(err);
                res.redirect('/login');
            }else{
                passport.authenticate('local')(req, res, function(){
                    console.log(req.isAuthenticated());
                    res.redirect('/');
                })

            }
        });

    }else{
        res.redirect('/register');
    }
});

let cartchoice = [];

app.get('/store', (req, res) => {
    var shop = product.find({}).then(function(data){
        data.forEach(element => {
        });
        res.render('store.ejs', {currentdate:datemod.date(), year:year, product:data});
    })
    
});
app.post('/store', function(req, res) {
    // bug alert when page is reloaded how to handle the data.

    // get value of cart item
    var constumerRequest = req.body.value;
    if(!cartchoice.includes(constumerRequest)){
        cartchoice.push(constumerRequest);
    }else{
        console.log('triggered');
    }
    // when reloaded enters an infinite loop.
    res.redirect('/store');
});

var i = 0;
var num = 0;
const prices = [];
const images = [];
app.get('/checkout', function(req, res) {
    if(!req.isAuthenticated()){
        res.redirect('login');
    }else{
        
        if (cartchoice.length === 0){
            res.redirect('/store');
        }else{
            const counts = {};
            for (const item of cartchoice) {
                if (counts[item]) {
                    counts[item]++;
                } else{ 
                    counts[item] = 1;
                }
            }
            let keys = Object.keys(counts);
            let value = Object.values(counts);
            Promise.all(keys.map(key => {
                return product.findOne({ title: key }).exec()
                  .then(item => {
                    if (!images.includes(item.images_list[0])){
                        prices.push(item.price);
                        images.push(item.images_list[0]);
                    }
                    });
                })).then(() => {
                  res.render('checkout.ejs', {currentdate:datemod.date(), year:year, entrykeys:keys, entryvalues:value, data:prices, image:images});
                }

                )    
        }
    }

});


// searched item
//  we used : to define the parameter in the url.
app.get('/search/:searched', function(req, res) {
    res.render('notavaliable.ejs', {currentdate:datemod.date(), item:searched, year:year})
});
// post search
app.post('/search', function(req, res) {
    searched = req.body.search;
    res.redirect('/search/'+searched);
});

// add emails to database and send them timely updates
app.get('/newsletter',function(req, res) {
    res.render('newsletter.ejs', {email:email_address, currentdate:datemod.date(), year:year});
});

app.post('/newsletter',function(req, res) {
    email_address = req.body.newsletter;
    res.redirect('/newsletter');
});

// not completed yet.
app.get('/category',function(req, res) {
    res.render('shopcategory.ejs',{});
});

app.listen(portal, function () {
    console.log("server is now running on port "+portal);
});
