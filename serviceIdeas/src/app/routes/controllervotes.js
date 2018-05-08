var VerifyToken = require('./VerifyToken');
const dbConnection = require('../../config/dbConnection');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');
var logger = require('../../config/log');
var amqp = require('amqplib/callback_api');

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
            amqp.connect('amqp://localhost', function(err, conn) {
                conn.createChannel(function(err, ch) {
                    var q = 'VOTES';
                    var msg = "{refrescar}";

                    ch.assertQueue(q, { durable: true });
                    ch.sendToQueue(q, new Buffer(msg), { persistent: true });
                    console.log(" [x] Sent '%s'", msg);
                    logger.info(" [x] Sent '%s'", msg);
                });
                setTimeout(function() {
                    conn.close();
                    //process.exit(0) 
                }, 500);
            });
            console.log("Vote Inserted");
            logger.info("Vote Inserted");
        });
        res.end();
        logger.info("End Insert vote");
    });

    app.delete('/votes', VerifyToken, (req, res) => {
        logger.info("Begin Delete vote");

        const { ideaid } = req.body;

        var sql = "DELETE FROM dbideas.votes WHERE userid = '" + req.userId + "' AND ideaid = " + ideaid;
        console.log(sql);

        connection.query(sql, function(err, result) {
            if (err) {
                res.json({ error: err })
            };
            amqp.connect('amqp://localhost', function(err, conn) {
                conn.createChannel(function(err, ch) {
                    var q = 'VOTES';
                    var msg = '{id-user:' + req.userId + '}';
                    ch.assertQueue(q, { durable: false });
                    // Se envia a la cola para que se actualize los votos 
                    ch.sendToQueue(q, new Buffer(msg));
                    console.log(" [x] Sent instruction %s", msg);
                    logger.info("Sent Actualize Votes to Queue");
                });
                setTimeout(function() {
                    conn.close();
                    //    process.exit(0)
                }, 500);
            });
            console.log("Vote Deleted");
            logger.info("Vote Deleted");
        });
        res.end();
        logger.info("End Delete vote");
    });
};