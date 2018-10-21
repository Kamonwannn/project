var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://lsfslknfpvrgaz:6efc58bd43c601443f09c95dca57f51278a998fe274e1c9d69f054030fcf87f1@ec2-54-204-14-96.compute-1.amazonaws.com:5432/dcv9p2da8fcels?ssl=true');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.static ('static') );
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
        
    });

    app.get('/about', function(req, res) {
        var name = ['BUBBLE'];
        var hobbies = ['Music','Movie','Programming'];
        var bdate ='27/03/1997';
        res.render('pages/about',{fullname : name, hobbies:hobbies,bdate: bdate});
            
        });

    //Display all products
    app.get('/products', function(req, res) {
        var id = req.param('id');
        var sql='select* from products';
        
            if(id){
                sql += ' where id ='+id;
            }
       db.any(sql)//connectdb
        .then(function(data){
            console.log('DATA:'+data);
            res.render('pages/products',{products: data})
            
        })
        .catch(function(error){
            console.log('ERROR:'+error);
        })
        
    });
    
    //selecte product:pid
    app.get('/products/:pid', function(req, res) {
        var pid = req.params.pid;
        var sql='select * from products where id =' + pid;
       db.any(sql)
        .then(function(data){
            res.render('pages/product_edit',{product: data[0]})
        })
        .catch(function(error){
            console.log('ERROR:'+error);
        })
    });

//update data product
app.post('/products/update', function(req, res) {
var id = req.body.id;
var title = req.body.title;
var price = req.body.price;
var sql = `update products set title = '${title}',price=${price} where id = ${id}` ;
db.query(sql);
res.redirect('/products');
db.close();
     });   

     
//insert data product
app.post('/product/inst_product', function(req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time =req.body.time;
    var sql = `INSERT INTO products (id,title,price,created_at) VALUES ('${id}', '${title}', '${price}', '${time}')`;
    
    console.log('UPDATE:' + sql);
    db.query(sql)
    .then(function (data) {
        console.log('DATA:' + data);
        res.redirect('/products')
        db.close();
    })

    .catch(function (error) {
        console.log('ERROR:' + error);
    })
});  

     
//delete data product
app.post('/products/delete', function(req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `DELETE FROM users  where id = ${id}` ;
    db.query(sql);
    res.redirect('/products');
    db.close();
         });   


   //Display all user
   app.get('/users', function(req, res) {
    var id = req.param('id');
    var sql='select* from users';
    
        if(id){
            sql += ' where id ='+id;
        }
   db.any(sql)//connectdb
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/users',{users: data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
    })
    
});


                 ///localhost
                 var port = process.env.PORT || 8080;
                 app.listen(port, function() {
                 console.log('App is running onxxx http://localhost:' + port);
                 });