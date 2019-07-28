const http = require('http');
const app = require('./app');
const {expressConfig} = require('./config');

//temp port address
const server = http.createServer(app);
const port = expressConfig.port;
server.listen(port, ()=>{
    console.log('Server stated at port ', port);
});


