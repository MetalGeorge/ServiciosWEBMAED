const mysql = require('mysql');

var pool = mysql.createPool({
    host: "servidormaedwebserviciosweb.mysql.database.azure.com",
    user: "adminjoraca@servidormaedwebserviciosweb",
    password: "Maestria.123",
    database: 'dbideas'
});

exports.pool = pool;