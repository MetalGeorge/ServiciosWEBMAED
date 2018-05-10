var VerifyToken = require('./VerifyToken');
var dbConnection = require('../../config/dbConnection').pool;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');
var logger = require('../../config/log');

module.exports = app => {

    app.use(function(idea, req, res, next) {
        res.status(200).send(idea);
    });

    app.get('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin List ideas");
        dbConnection.getConnection(function(err, connection) {
            connection.query('SELECT * FROM dbideas.ideas ORDER BY id', (err, result) => {
                res.json(result);
            });
            connection.release();
        });

        logger.info("End List ideas");
    });

    app.post('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin Insert ideas");

        const { idea } = req.body;
        var sql = "INSERT INTO dbideas.ideas (idea, proposername, votes,userid) VALUES('" + idea + "', '" + req.name + "', 0,'" + req.userId + "');";
        console.log(sql);

        dbConnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if (err) {
                    res.json({ error: err })
                };
                console.log("Idea inserted");
                logger.info("Idea inserted");
            });
            res.end();
            connection.release();
        });

        logger.info("End Insert ideas");
    });

    app.delete('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin Delete ideas");
        const { ideaid } = req.body;

        var sql = "DELETE FROM dbideas.ideas WHERE id =  " + ideaid;
        console.log(sql);

        dbConnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if (err) {
                    res.json({ error: err })
                };
                console.log("Idea Deleted");
                logger.info("Idea Deleted");
            });
            sql = "DELETE FROM dbideas.votes WHERE ideaid =  " + ideaid;
            connection.query(sql, function(err, result) {
                if (err) {
                    res.json({ error: err })
                };
                console.log("Votes Deleted");
                logger.info("Votes Deleted");
            });


            res.end();
            connection.release();
        });

        logger.info("End Delete ideas");
    });
};