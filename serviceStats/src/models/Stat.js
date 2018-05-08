const dbConnection = require('../config/dbConnection');

var Stat = {

    updatestatbyproposer: function(proposerid) {
        const connection = dbConnection();
        sql = "update ideas set votes=(select count(*) from votes'";
        sql = sql + " where votes.ideaid=ideas.id) where ideaid in ";
        sql = sql + " (SELECT distinct ideaid FROM votes where userid='" + proposeid + "')";
        connection.query(sql, (err, result) => {
            console.log("actualizo con exito");
        });
        connection.end();
    },
    updatestatbyidea: function(ideaid) {
        const connection = dbConnection();
        sql = "update ideas set votes=(select count(*) from votes where votes.ideaid=ideas.id) where id=" + ideaid;
        connection.query(sql, (err, result) => {
            console.log("actualizo con exito");
        });
        connection.end();

    },


};

module.exports = Stat;