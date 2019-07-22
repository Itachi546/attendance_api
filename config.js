const express_config = {
    //port:process.env.PORT || 3000
    port:process.env.PORT || 3001
};

const databaseName = 'schema_attendance';
const database_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: databaseName
};

module.exports.databaseConfig = database_config;
module.exports.expressConfig = express_config;