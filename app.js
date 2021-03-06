const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();


//set views File
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//for multer Storage
var multerStorage = multer.diskStorage({
  destination: function(req,file,callback){
    callback(null,path.join(__dirname,'my_uploads'));
  },
  filename:function(req,file,callback){
    callback(null, Date.now() + '_'+ file.originalname);
  }
});

//for Single File Upload
var multerSigleUpload = multer({ storage:multerStorage});

//for Multiple File Upload
var multerMultipleUpload = multer({ storage: multerStorage }).array("multipleImage", 3);



//Base index route
app.get('/',function(req,res){
  const uploadStatus = req.app.locals.uploadStatus;
  req.app.locals.uploadStatus = null;
  res.render('file_upload', {
    title: 'File Upload using Multer in Node.js and Express',
    uploadStatus : uploadStatus
  });
});



//route for single file upload
app.post("/singleFile", multerSigleUpload.single('singleImage'), function(req,res){
  const file = req.file
  if(!file){
    return res.end("Please choose file to upload!");
  }
  req.app.locals.uploadStatus = true;
  res.redirect('/');
});

//route for multiple file upload
app.post("/multipleFile", function(req,res){
  multerMultipleUpload(req,res, function(err){
    if(err){
      return res.end("File uploading unsuccessfully!");
    }
    req.app.locals.uploadStatus = true;
    res.redirect('/');
  });
});
//server listening
app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
