const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//Routes
const studentRoute = require('./api/routes/student');
const subjectRoute = require('./api/routes/subject');
const instructorRoute = require('./api/routes/instructor');
const attendanceRoute = require('./api/routes/attendance');
const classRoute = require('./api/routes/class');

//Debug setup
app.use(morgan('dev'));

//Utility tools to read request body
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());

//CORS handling
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Authorization, Content-Type');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

//Forward routes
app.use('/student', studentRoute);
app.use('/class', classRoute);
app.use('/attendance', attendanceRoute);
app.use('/subject', subjectRoute);
app.use('/instructor', instructorRoute);

//Forward request to error handler
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handling Error for all types
app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.json({
        error:{
            message : err.message
        }
    });
});

module.exports = app;