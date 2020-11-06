let express=require('express');
let router= express.Router();
let category= require('../schema/categoryModel');
let subCategory=require('../schema/subCategoryModel');

router.post('/addCategory', async(req,res)=> {
    let{error}= await category.validateData(req.body);
    if(error){return res.status(404).send(error.details[0].message)};

    let c= await category.categoryModel.findOne({"categoryName":req.body.categoryName});
    if(c){return res.status(404).send({message:"category already Present"})};
  
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
    if(!cat){return res.status(400).send({message:"Category Not Found"})};

    res.send(cat);
});

router.delete('/deleteCategoryById/:id', async(req,res)=>{
    let catId= await category.categoryModel.findByIdAndDelete(req.params.id);
    if(!catId){return res.status(404).send({message:"Category not Found"})};

    res.send({message: catId.categoryName + " deleted successfull"});
});

router.get('/pageIndex/:page', async(req,res)=>{
    let perPage=3;
    let currentPage= req.params.page || 1;
    let data=await category.categoryModel.find()
                                         .select('categoryName')
                                         .skip((currentPage*perPage)-perPage)
                                         .limit(perPage);

    let totalcount= await category.categoryModel.find().count();
    let totalpage= Math.ceil(totalcount/perPage);

    res.send({
        data: data,
        perPage: perPage,
        currentPage: currentPage,
        totalpage: totalpage
    });
})

module.exports= router;