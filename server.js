//@TODO
/*
*
*
*/

const http = require('http');
const app = require('./app');

//temp port address
const port = 3000;
const server = http.createServer(app);

server.listen(port, ()=>{
    console.log('Server stated at port 3000');
});


