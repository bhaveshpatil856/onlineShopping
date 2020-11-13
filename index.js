let express= require('express');
let app= express();
let mongoose= require('mongoose');
let config= require('config')

let port= process.env.PORT || 4800;

require('./startup/routes') (app);
require('./startup/connection.db')(mongoose);
require('./startup/config') (config);

app.listen(port, ()=> console.log('port working on ' + port));