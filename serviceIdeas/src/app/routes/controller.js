var VerifyToken = require('./VerifyToken');
const dbConnection = require('../../config/dbConnection');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');
var logger = require('../../config/log');

module.exports = app => {

    const connection = dbConnection();

    app.use(function(idea, req, res, next) {
        res.status(200).send(idea);
    });

    app.get('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin List ideas");
        connection.query('SELECT * FROM dbideas.ideas ORDER BY id', (err, result) => {
            res.json(result);
        });
        logger.info("End List ideas");
    });

    app.post('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin Insert ideas");

        const { idea } = req.body;
        var sql = "INSERT INTO dbideas.ideas (idea, proposername, votes,userid) VALUES('" + idea + "', '" + req.name + "', 0,'" + req.userId + "');";
        console.log(sql);

        connection.query(sql, function(err, result) {
            if (err) {
                res.json({ error: err })
            };
            console.log("Idea inserted");
            logger.info("Idea inserted");
        });
        res.end();
        logger.info("End Insert ideas");
    });

    app.delete('/ideas', VerifyToken, (req, res) => {
        logger.info("Begin Delete ideas");
        const { ideaid } = req.body;

        var sql = "DELETE FROM dbideas.ideas WHERE id =  " + ideaid;
        console.log(sql);

        connection.query(sql, function(err, result) {
            if (err) {
                res.json({ error: err })
            };
            console.log("Idea Deleted");
            logger.info("Idea Deleted");
        });
        res.end();
        logger.info("End Delete ideas");
    });
};