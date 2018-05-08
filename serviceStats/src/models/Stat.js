const dbConnection = require('../config/dbConnection');


var Stat = {

    updatestatbyproposer: function(callback) {
        return dbConnection.query("SELECT * FROM votes", callback);
    },
    updatestatbyidea: function(ideaid, callback) {
        const connection = dbConnection();
        connection.query('SELECT * FROM dbideas.votes ORDER BY id', (err, result) => {
            // res.json(result);
        });
        return {};

        //dbConnection.query("SELECT * FROM ideas where id=" + ideaid, callback);
    },


};

module.exports = Stat;