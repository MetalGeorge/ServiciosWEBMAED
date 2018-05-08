const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: "servidormaedwebserviciosweb.mysql.database.azure.com",
        user: "adminjoraca@servidormaedwebserviciosweb",
        password: "Maestria.123",
        database: 'dbideas'
    });
}