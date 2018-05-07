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

    // confirmar si esto es requerido
    app.get('/votes', VerifyToken, (req, res) => {
        logger.info("Begin List votes");
        connection.query('SELECT * FROM dbideas.votes ORDER BY id', (err, result) => {
            res.json(result);
        });
        logger.info("End List votes");
    });

    app.post('/votes', VerifyToken, (req, res) => {
        logger.info("Begin Insert vote");
        const { ideaid } = req.body;

        var sql = "INSERT INTO dbideas.votes (userid, ideaid) VALUES ('" + req.userId + "', " + ideaid + ");";
        console.log(sql);

        connection.query(sql, function(err, result) {
            if (err) {
                res.json({ error: err })
            };
            console.log("Vote Inserted");
            logger.info("Vote Inserted");
        });
        res.end();
        logger.info("End Insert vote");
    });

    app.delete('/votes', VerifyToken, (req, res) => {
        logger.info("Begin Delete vote");

        const { voterid, ideaid } = req.body;

        var sql = "DELETE FROM dbideas.votes WHERE voterid = '" + voterid + "' OR ideaid = " + ideaid;
        console.log(sql);

        connection.query(sql, function(err, result) {
            if (err) {
                res.json({ error: err })
            };
            console.log("Vote Deleted");
            logger.info("Vote Deleted");
        });
        res.end();
        logger.info("End Delete vote");
    });
};