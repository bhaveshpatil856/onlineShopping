
module.exports= (config) => {
    if(!config.get('jwtPrivateKey'))
    {
        console.error('FATAL ERROR....jwt key does not defined');
        process.exit(0);
    }
}