let mysql = require('mysql');
let express = require('express');

let {databaseConfig} = require('../../config');

class Database {
    constructor() {

        this.pool = mysql.createPool(databaseConfig);
        
        this.pool.getConnection((err, connection) => {
            if(err) next(err);
            this.createTable();
        });
    }

    query(sql){
        return new Promise((resolve, reject)=>{
            this.pool.query(sql, (err, rows)=>{
                if(err) return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise( ( resolve, reject ) => {
            this.pool.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            });
        });
    }

    createTable() {
        let sql = 'CREATE TABLE IF NOT EXISTS student (roll_no varchar(16), name varchar(64), email varchar(64), PRIMARY KEY(roll_no))';
        this.query(sql);

        sql = 'CREATE TABLE IF NOT EXISTS class (name varchar(64), year INT, part INT, PRIMARY KEY(name))';
        this.query(sql);

        sql = 'CREATE TABLE IF NOT EXISTS subject (code varchar(16), name varchar(64), PRIMARY KEY(code))';
        this.query(sql);

        sql = 'CREATE TABLE IF NOT EXISTS instructor (id varchar(64), name varchar(64), email varchar(64), PRIMARY KEY(id))';
        this.query(sql);

        /*
            Attendance table has a composite unique key
            (student_id, subject_code, attendance_date)
        */
        sql = 'CREATE TABLE IF NOT EXISTS attendance (student_id varchar(16), subject_code varchar(16), class_id varchar(64), attendance_date date, instructor_id varchar(16), present char, UNIQUE KEY(student_id, attendance_date, subject_code))';
        this.query(sql);

        sql =`ALTER TABLE attendance
                          ADD FOREIGN KEY(student_id) REFERENCES student(roll_no),
                          ADD FOREIGN KEY(subject_code) REFERENCES subject(code),
                          ADD FOREIGN KEY(class_id) REFERENCES class(name),
                          ADD FOREIGN KEY(instructor_id) REFERENCES instructor(id)`;
    
        this.query(sql);
    }
}

let database = new Database();
module.exports = database;

