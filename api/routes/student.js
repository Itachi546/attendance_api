let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message:'Get Student Details'
    });
});

router.post('/', (req, res, next)=>{
    res.status(200).json({
        message:'Post Student Details'
    });
});

module.exports = router;