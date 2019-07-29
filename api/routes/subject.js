let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/:classId/:year/:part/', (req, res, next)=>{
    const {classId, year, part} = req.params;
    let sql = `SELECT subject.code as subjectCode,
               subject.name as subject,
               instructor.name as instructor
               from 
               (SELECT DISTINCT class_id, instructor_id, subject_code from attendance where class_id = "${classId}") as c 
               join subject on c.subject_code = code
               join instructor on instructor_id = instructor.id
               where year = ${year} and part = ${part}`
    
    db.query(sql)
    .then(rows=>{
        console.log(rows);
        res.status(200).json(
            rows
        );
        return rows;
    })
    .catch(next)
    
});

module.exports = router;