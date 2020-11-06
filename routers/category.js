let express=require('express');
let router= express.Router();
let category= require('../schema/categoryModel');
let subCategory=require('../schema/subCategoryModel');

router.post('/addCategory', async(req,res)=> {
    let{error}= await category.validateData(req.body);
    if(error){return res.status(404).send(error.details[0].message)};
  
    let cat= new category.categoryModel({
        categoryName: req.body.categoryName,
        // subCategory: [subCat.subCatSchema]
    });

    await cat.save();

    res.send(cat);

});

router.get('/showCategories', async(req,res)=>{
    let cat= await category.categoryModel.find()
                                         .select('-_id categoryName');

    res.send(cat);
});

router.get('/categorybyId/:id', async(req,res)=> {
    let cat=await category.categoryModel.findById(req.params.id);

    res.send(cat);
});

router.delete('/deleteCategoryById/:id', async(req,res)=>{
    let catId= await category.categoryModel.findByIdAndDelete(req.params.id);
    if(!catId){return res.status(404).send({message:"Category not Found"})};

    res.send({message: catId.categoryName + " deleted successfull"});
});



module.exports= router;