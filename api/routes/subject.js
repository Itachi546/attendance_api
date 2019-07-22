let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/:classId/:instructorId?', (req, res, next)=>{
    const classId = req.params.classId;
    let instructorId = req.params.instructorId;
    instructorId = instructorId === 'all' ? '%' : instructorId;
    console.log(instructorId);
    let sql = `with cte as (SELECT DISTINCT subject_code,instructor_id from attendance where
         class_id ='${classId}' )
         SELECT subject_code as subjectCode, subject.name, instructor.name as instructor from cte
         join subject on cte.subject_code= subject.code
         join instructor on cte.instructor_id = instructor.id`
    
    db.query(sql)
    .then(rows=>{
        console.log(rows);
        res.status(200).json(
            rows
        );
        return rows;
    })
    .catch(err=>{
        res.status(400).json(
            err
        );
        console.log(err);
        return err;
    })
    
});

router.post('/', (req, res, next)=>{
    res.status(200).json({
        message:'Post Subject Details'
    });
});


module.exports = router;