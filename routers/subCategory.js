let express=require('express');
let router= express.Router();
let category= require('../schema/categoryModel');
let subCategory= require('../schema/subCategoryModel');

router.post('/addSubCategory', async(req,res) => {

    let{error}= await subCategory.validateData(req.body);
    if(error){return res.status(404).send(error.message)};

    let sc= await subCategory.subCatModel.findOne({"name":req.body.name});
    if(sc){return res.status(400).send({message:"SubCategory already present"})};

    let subCat= new subCategory.subCatModel({
        name: req.body.name,
        catName: req.body.catName
    });

    await subCat.save();

    res.send(subCat);

});

router.get('/showSubCategories', async(req,res)=> {
    let data=await subCategory.subCatModel.find().select('-__v');
    res.send(data);
});

router.get('/SubCatogeryPageIndex/:page', async(req,res)=>{
    let perPage= 3;
    let currentpage= req.params.page || 1;
    let data=await subCategory.subCatModel.find()
                                          .select('-__v')
                                          .skip((currentpage*perPage)-perPage)
                                          .limit(perPage);

    let totalCount= await subCategory.subCatModel.find().count();
    let totalPages= Math.ceil(totalCount/perPage);

    if(currentpage>totalPages){return res.status(400).send({message:"invalid Page Index..."})};

    res.send({
        data: data,
        perPage: perPage,
        currentpage:currentpage,
        totalpages: totalPages
    });

});

module.exports= router;