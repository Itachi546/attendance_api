let express = require('express');
let db = require('./database')

let router = express.Router();

function insertSubject(code, name) {
    let q1 = `SELECT code from subject where code = "${code}"`;
    let q2 = `INSERT IGNORE INTO subject (code, name) VALUES ("${code}", "${name}")`;
    /*
    db.query(sql, (err, res)=>{

        if(err) throw err;
        if(res.length === 0){
            sql = `INSERT INTO subject (code, name) VALUES ("${code}", "${name}")`;
        
            db.query(sql,(err,res)=>{
                if(err) throw err;
            });
        
        }

    });
    */
    return q2;
}

function insertInstructor(code, name) {
    let q1 = `SELECT id from instructor where id = "${code}"`;
    let q2 = `INSERT IGNORE INTO instructor (id, name) VALUES ("${code}", "${name}")`;

    /*
    db.query(sql, (err,res)=>{
        if(err) throw err;
        if(res.length === 0){
            sql = `INSERT INTO instructor (id, name) VALUES ("${code}", "${name}")`;
            db.query(sql,(err,res)=>{
                if(err) throw err;
            });
        }
    });
    */
    return q2;
}

function insertStudent(students) {
    let q1 = students.reduce((accumulator, currentValue) => {
        return accumulator + `("${currentValue.Roll}", "${currentValue.Name}"),`
    }, '');
    return `INSERT IGNORE INTO student (roll_no, name) VALUES ` + q1.slice(0, -1);

}

function insertClass(name) {
    let q1 = `INSERT IGNORE INTO class (name) VALUES ("${name}")`;
    return q1;
}

function insertAttendance(body, students) {

    let q1 = `INSERT INTO attendance (student_id, subject_code, class_id, attendance_date, instructor_id, present) VALUES `;
    let q2 = students.reduce((accumulator, currentValue) => {
        return accumulator + `("${currentValue.Roll}", "${body.SubjectId}", "${body.Class}", "${body.Date}", "${body.InstructorId}", "${currentValue.Status}"),`
    }, '');
    return q1 + q2.slice(0, -1);
}

//@TODO return status message in json reply
function insertData(body, students) {
    db.query(insertSubject(body.SubjectId, body.Subject))
        .then(row => {
            console.log(row);
            return db.query(insertInstructor(body.InstructorId, body.Instructor))
        })
        .then(row => {
            console.log(row);
            return db.query(insertClass(body.Class))
        })
        .then(row => {
            console.log(row);
            if (row.affectedRows !== 0) {
                return db.query(insertStudent(students))
            }
        })
        .then(row => {
            console.log(row);
            return db.query(insertAttendance(body, students))
        })
        .then(row => {
            console.log(row);
        })
        .catch(err => {
            const errorString = err.code + ' ' + err.sqlMessage;
            const error = new Error(errorString);
            error.status = err.errno;
            console.log(errorString);
        });
}
//@TODO return status message
router.get('/getRecent/:numData', (req, res, next) => {
    const numData = req.params.numData;
    let q1 = `SELECT DISTINCT a.class_id as class,
                             a.attendance_date as date,
                             i.name as instructor,
                             s.name as subject,
                             s.code as subjectCode
                             from attendance as a join instructor as i on a.instructor_id = id
                             join subject as s  on  a.subject_code = s.code
                              order by attendance_date desc limit ${numData}`;
    db.query(q1)
    .then(row => {
        res.status(200).json(
            row
            );
        })
        .catch(err=>{
            console.log(err);
        })
    });
    
    //@TODO add instructor id also
    router.get('/getAttendance/:classId/:subjectId/:date/:instructor', (req, res, next) => {
        const {subjectId, classId, date, instructor} = req.params;
        const q1 = `SELECT rollNo, name, status from (SELECT student_id as rollNo, present as status from attendance where
                    class_id ='${classId}' and
                    subject_code='${subjectId}' and
                    attendance_date ='${date}')
                    as a join student where rollNo = student.roll_no order by rollNo`;
       
        db.query(q1)
        .then(row=>{
            res.status(200).json(
                row
            );
        })
    .catch(err=>{
        //Maybe not working
        console.log(err);
    })
});

//@TODO same subject, same class but different instructor
router.get('/all/:classId/:subjectCode/:instructor', (req, res)=>{
    const {classId,subjectCode, instructor} = req.params;
    const sql = `SELECT rollNo, name, date, status 
                 from (SELECT student_id as rollNo,
                 GROUP_CONCAT(attendance_date order by attendance_date) as date,
                 GROUP_CONCAT(present order by attendance_date) as status
                 from attendance where
                 class_id = "${classId}" and
                 subject_code ="${subjectCode}" and
                 instructor_id = (SELECT id from instructor where name="${instructor}") 
                 group by student_id) as s
                 left join student on s.rollNo = roll_no`
    db.query(sql)
    .then(rows=>{
        res.status(200).json(rows);
        return rows;
    })
    .catch(err=>{
        console.log(err);
        return err;
    });
})

router.post('/', (req, res, next) => {
    let body = req.body;
    let students = body.Students;

    const status = insertData(body, students, next);
    res.status(400).json({
        message: 'Post Attendance Details'
    });
});

module.exports = router;