const dbConnection = require('../config/dbConnection');

var Stat = {

    updatestatbyproposer: function(userid) {
        const connection = dbConnection();
        sql = "update ideas set votes=(select count(*) from votes'";
        sql = sql + " where votes.ideaid=ideas.id) ";
        console.log(sql);
        connection.query(sql, (err, result) => {
            console.log("actualizo con exito");
        });
        connection.end();
    },
    updatestatbyidea: function(ideaid) {
        const connection = dbConnection();
        sql = "update ideas set votes=(select count(*) from votes where votes.ideaid=ideas.id) where id=" + ideaid;
        console.log(sql);
        connection.query(sql, (err, result) => {
            console.log("actualizo con exito");
        });
        connection.end();

    },


};

module.exports = Stat;