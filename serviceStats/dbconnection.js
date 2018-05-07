var mysql=require('mysql');

var connection=mysql.createPool({
 
 host:'servidormaedwebserviciosweb.mysql.database.azure.com',
 user:'adminjoraca@servidormaedwebserviciosweb',
 password:'Maestria.123',
 database:'dbideas'
 
});

module.exports=connection;