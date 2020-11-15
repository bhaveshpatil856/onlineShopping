let express= require('express');
let multer= require('multer');
let router= express.Router();
let product= require('../schema/products');

let port="http://localhost:4800";

let storage= multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, './images/');        
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);        
    }
});

let fileFilter= function(req,file,cb){
    if(file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif" || file.mimetype == "image/apng")
    {
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

let uploads= multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.post('/image', uploads.single('file'),async(req,res)=>{

    let file= port + '/images/' + req.file.filename;
    console.log(file);

    return file;

})

module.exports= router;