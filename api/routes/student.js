let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(400).json({
        message:'Get Student Details'
    });
});

router.post('/', (req, res, next)=>{
    res.status(400).json({
        message:'Post Student Details'
    });
});

module.exports = router;