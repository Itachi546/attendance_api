let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/', (req, res, next)=>{
    let sql = 'SELECT DISTINCT name, email from instructor';
    db.query(sql)
    .then(row=>{
        res.status(200).json(row);
        return row;
    })
    .catch(err=>{
        res.status(400).json(err);
        return err;
    })
});

router.post('/', (req, res, next)=>{
    res.status(200).json({
        message:'Post Instructor Details'
    });
});

module.exports = router;