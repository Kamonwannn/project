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
                sql += ' where id ='+id +' order by id ASC';
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

    
     // delete Product 
app.get('/product_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.redirect('/products');
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });



//insert data product

app.post('/product/insert_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time =req.body.time;
    var sql = `INSERT INTO products (id,title,price,created_at) VALUES ('${id}', '${title}', '${price}', '${time}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
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


         //add  New Product

app.post('/product/insert_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time =req.body.time;
    var sql = `INSERT INTO products (id,title,price,created_at) VALUES ('${id}', '${title}', '${price}', '${time}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//time add product
app.get('/insert_product', function (req, res) {
    var time = moment().format();
    res.render('pages/insert_product',{ time: time});
});



//report Products 
app.get('/product_report', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products ORDER BY Price DESC limit 50';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/product_report', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

// ------------------------------------------------------------------------------

   //Display all user
   app.get('/users', function(req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if(id){
        sql += ' where id ='+ id +' order by id ASC';
    }
  
   db.any(sql +' order by id ASC')
      .then(function(data){
          console.log('DATA:'+ data);
          res.render('pages/users',{users : data})
  
      })
      .catch(function(error){
          console.log('ERROR:'+ error);
  
      })
  });

//select  user for update
app.get('/users/:id', function(req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if(id){
        sql += ' where id ='+ id;
    }
  
   db.any(sql)
      .then(function(data){
          console.log('DATA:'+ data);
          res.render('pages/user_edit',{users : data[0]})
  
      })
      .catch(function(error){
          console.log('ERROR:'+ error);
  
      })
  });

  
  // Delete user
app.get('/user_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM users';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.redirect('page/users');
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });


 //update user

app.post('/users/update',function (req,res) {
    var id =req.body.id;
    var email =req.body.email;
    var password =req.body.password;
    var sql=`update users set email='${email}',password='${password}' where id=${id}`;
    // res.send(sql)
    //db.none
    db.query(sql);
        res.redirect('/users')    
    db.close();
    })


 //add user

app.post('/user/insert_user', function (req, res) {
    var id = req.body.id;
    var email =req.body.email;
    var password =req.body.password;
    var time =req.body.time;
    var sql = `INSERT INTO users (id,email,password,created_at) VALUES ('${id}', '${email}', '${password}', '${time}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//time add user
app.get('/insert_user', function (req, res) {
    var time = moment().format();
    res.render('pages/insert_user',{ time: time});
});


//report user
app.get('/user_report', function (req, res) {
    db.any('select * from users ORDER BY  ID ASC limit 50', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/user_report', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});


                 ///localhost
                 var port = process.env.PORT || 8080;
                 app.listen(port, function() {
                 console.log('App is running onxxx http://localhost:' + port);
                 });