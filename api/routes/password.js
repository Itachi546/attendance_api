let express = require('express');
let db = require('./database')
let router = express.Router();



router.post('/', (req, res, next)=>{
   let body = req.body;
   console.log(body);
});

module.exports = router;