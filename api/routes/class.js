let express = require('express');
let db = require('./database')
let router = express.Router();



router.get('/', (req, res, next)=>{
   let sql = 'SELECT DISTINCT * from class';
   db.query(sql)
   .then(row=>{
       res.status(200).json(
           row
        )
       return row;
   })
   .catch(next);
});
router.get('/students/:classId', (req, res, next)=>{
    const classId = req.params.classId+'%';
    let sql = `SELECT distinct roll_no as rollno, name  from student where roll_no like "${classId}"`;
    db.query(sql)
    .then(row=>{
        res.status(200).json(
            row
         )
        return row;
    })
    .catch(next);
 });

module.exports = router;