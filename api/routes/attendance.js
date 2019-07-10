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
    .then(row=>{
        console.log(row);
        if(row.affectedRows !== 0){
            return db.query(insertStudent(students))
        }
    })   
    .then(row=>{
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
router.get('/', (req, res, next) => {
    res.status(400).json({
        message: 'Get Attendance Details'
    });
});

router.post('/', (req, res, next) => {
    let body = req.body;
    let students = body.Students;

    const status = insertData(body, students, next);
    res.status(400).json({
        message: 'Post Attendance Details'
    });
});

module.exports = router;