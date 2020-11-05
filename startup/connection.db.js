let config=require('config');

module.exports = (mongoose) => {
    mongoose.connect('mongodb+srv://lucifer856:'+config.get('dbPassword')+'@cluster0.4oys3.mongodb.net/Shopping?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})
            .then(() => console.log("Database Connected"))
            .catch(error => console.log(`Something went WRONG... ${error.message}`));
}





// git config --global user.email "bhaveshpatil856@gmail.com"
// git config --global user.name "bhaveshpatil856"
