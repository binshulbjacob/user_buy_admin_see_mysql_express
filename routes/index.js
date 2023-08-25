var express = require('express');
var router = express.Router();
var db=require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/register', function(req, res) {
  res.render('register');
});

/*user registration*/

router.post('/action',function(req,res)
{
  var name=req.body.name
  var email=req.body.email
  var password=req.body.password
  var mobileno=req.body.mobileno
  var sql=`insert into library(name,email,	password,mobileno) values("${name}","${email}","${	password}","${mobileno}")`;
db.query(sql,function(err,result){
  if(err) throw err;
  res.redirect('/');
})
})

////login///
router.get('/userlog', function(req, res) {
  res.render('userlog');
});
////login/with user admin//
router.post('/login1',(req,res)=>{
  var email=req.body.email
  var password=req.body.password
   var query =`SELECT * FROM library WHERE email='${email}' AND password ='${password}'`
   db.query(query,(error,result)=>{
    if(error){
      console.error(error);
      return res.redirect('/userlog')
    }
     if(result.length >0){
      req.session.user=email;

      if(result[0]['usertype']=='1'){
      return res.redirect('/userhome')

     }else if(result[0]['usertype']=='0'){
      return res.redirect('/adminregister')
     }else{
      return res.redirect('/register')
     }
    }
   });
});

/*user welcome display*/

router.get('/userhome', function(req, res, next) {
  var email=req.session.user
  var sql=`select * from library  where email='${email}'`
  db.query(sql,function(err,rows){
  if(err) throw err;
  res.render('userhome',{data3:rows});
}) ;
});

////admin product add////

router.get('/adminregister', function(req, res) {
  res.render('adminregister');
});

router.post('/action1',function(req,res)
{
  var author=req.body.author
  var bookname=req.body.bookname
  var price=req.body.price
  var publishdate=req.body.publishdate
  var quantity=req.body.quantity
  var sql=`insert into adminreg (author,bookname,	price,publishdate,quantity) values("${author}","${bookname}","${	price}","${publishdate}","${quantity}")`;
  db.query(sql,function(err,result){
    if(err) throw err;
    res.redirect('/adminregister');
  })
  })
 ///product book view////
  
 router.get('/product', function(req, res, next) {
  var sql='select * from adminreg';
  db.query(sql,function(err,rows,fields){
    if (err) throw err;
  res.render('product',{data6:rows});
});
});

///delete///
router.get('/delete/:id', function(req,res){
  var id = req.params.id;
  var sql = `delete from adminreg where nid = ${id}`;
  db.query(sql, function(err, result){
    if(err) throw err;
    res.redirect('/product');
  })
})



///edit////

router.get('/edit/:id', function(req, res, next) {
  var id=req.params.id;
  var sql=`select * from adminreg where nid=${id};`
  db.query
  (sql,function(err,result){
    if (err) throw err;
    res.render("edit", { data: result}) 
  })
})


router.post('/edit2/:nid',function(req, res){
  var nid= req.params.nid
  var author=req.body.author
  var bookname=req.body.bookname
  var price=req.body.price
  var publishdate=req.body.publishdate
  var quantity=req.body.quantity

  var query=`update  adminreg set author='${author}',bookname='${bookname}',price='${price}',publishdate='${publishdate}',quantity='${quantity}' where nid=${nid}`;
  db.query(query,function (err,result){
    if (err) throw err;
  res.redirect('/product');
  });
});


// ////search data///
router.post('/search',function(req,res,next){
  var search=req.body.search
  // console.log(search)
  var sql=`select *  from adminreg WHERE author="${search}" `;
  db.query(sql,function(err,row,fields){
    if (err) throw err;
    //  console.log(row)
  res.render('userproduct',{data7:row})
})
  })



//product user view in other page inside////
 router.get('/userproduct', function(req, res, next) {
  var sql='select * from adminreg';
  db.query(sql,function(err,rows,fields){
    if (err) throw err;
  res.render('userproduct',{data7:rows});
});
});







/////userbuy/database show///////

router.get('/buy3/:nid', function(req, res, next) {
  var nid=req.params.nid;
   var author=req.session.user;
    var sql=`insert into userbuy (author,authorid) values("${author}","${nid}");`

    db.query (sql,function(err,result){
    if (err) throw err;
    res.redirect("/userproduct") 
  })
})

/////userbuy admin see///////

router.get('/userbuy', function(req, res, next) {
  var sql='select * from userbuy';
  db.query(sql,function(err,rows,fields){
    if (err) throw err;
  res.render('userbuy',{data9:rows});
});
});

///logout////
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.log(err);
      }
      res.redirect('/userlog');
  });
});
////////////

router.get('/userbuyview', function(req, res,next){
  var email=req.session.user
  var sql=`SELECT * from userbuy INNER JOIN adminreg  ON  userbuy.authorid=adminreg.nid   INNER JOIN  library on  userbuy.author=library.email  WHERE library.email="${email}"`;
 
  // where userbuy.author="${email}"

  db.query(sql,function(err,row,result){
 console.log(email)

 if (err) throw err;
  res.render('userbuyview',{data9:row});
});
});





module.exports = router;