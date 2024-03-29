let express = require('express');
let db = require('./database')
let router = express.Router();

router.get('/:rollNo', (req, res, next) => {
    const rollNo = req.params.rollNo;
    let sql = ` SELECT subject.name as subject, instructor.name as instructor, year, part, present, totalDay from 
                (SELECT subject_code, instructor_id, COUNT(present) as totalDay,
                COUNT(CASE WHEN present='P' then 1 END) as present from attendance
                where student_id="${rollNo}" group by instructor_id) as s 
                join subject on s.subject_code = subject.code
                join instructor on s.instructor_id = id;`;

    db.query(sql)
        .then(row => {
            res.status(200).json(
                row
            );

        }).catch(next);
});

module.exports = router;