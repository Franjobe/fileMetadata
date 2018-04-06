 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';
var fs = require("fs");
var express = require('express');
var app = express();
var multer  = require('multer');
var path =require("path");

////////////////////////////////////////////////////////////////////////

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
       //console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}


// MIDDLEWARE
app.use('/public', express.static(process.cwd() + '/public'));




////////////////////////////////////////////////////////////////////////
// MULTER 
// https://www.youtube.com/watch?v=9Qzmri1WaaE&t=1094s
// https://www.npmjs.com/package/multer


// Define Storage. 
var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})


// Init Upload
var upload = multer({
             storage: storage 
             }); 

// ROUTE with Multer.
app.post('/upload', upload.single('myImage'), function (req, res) {
  // myImage is the fieldname in the index form. This single file will be stored in req.file
  // An input type="file" inside a form with method Post, allow apload an image that will be stored (by multer) inside the req.  
  // req.file is the image file, and req.body will hold the text fields, if there were any 
  
  if (req.file){ 
    var  size = req.file.size;
    var output = "FILE SIZE: "+ size;  
    res.send(output);
    //store file in body
    req.body.myImage = req.file.filename;
  } else {
    res.send("need a file!");
  }
  
  //store data in database.
  
});
 



////////////////////////////////////////////////////////////////////////

// ROUTING
app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})


// LISTEN
app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

