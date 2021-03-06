var VerifyToken = require('./VerifyToken');
var dbConnection = require('../../config/dbConnection').pool;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');
var logger = require('../../config/log');
var amqp = require('amqplib/callback_api');

module.exports = app => {

    app.use(function(idea, req, res, next) {
        res.status(200).send(idea);
    });

    app.get('/votes', VerifyToken, (req, res) => {
        logger.info("Begin List votes");
        dbConnection.getConnection(function(err, connection) {
            connection.query('SELECT * FROM dbideas.votes ORDER BY id', (err, result) => {
                res.json(result);
            });
            connection.release();
        });

        logger.info("End List votes");
    });

    app.post('/votes', VerifyToken, (req, res) => {
        logger.info("Begin Insert vote");
        const { ideaid } = req.body;

        var sql = "select count(*) as votoanterior from  votes where ideaid=" + ideaid + " and userid='" + req.userId + "'";
        console.log(sql);
        dbConnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if (err) {
                    res.json({ error: err })
                };
                console.log(result[0].votoanterior);
                if (result[0].votoanterior > 0) {
                    console.log('Ya ha votado');
                    res.status(500).send({ message: 'User has already voted to the idea' });


                } else {
                    sql = "INSERT INTO dbideas.votes (userid, ideaid) VALUES ('" + req.userId + "', " + ideaid + ");";
                    connection.query(sql, function(err, result) {
                        if (err) {
                            res.json({ error: err })
                        };
                        amqp.connect('amqp://localhost', function(err, conn) {
                            conn.createChannel(function(err, ch) {
                                var q = 'VOTES';
                                var msg = '{"operation":"REFRESH_VOTES_IDEA","ideaid":' + ideaid + '}';
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
                        res.end();
                    });
                }

            });

            connection.release();
        });

        logger.info("End Insert vote");
    });

    app.delete('/votes', VerifyToken, (req, res) => {
        logger.info("Begin Delete vote");

        const { ideaid } = req.body;

        var sql = "DELETE FROM dbideas.votes WHERE userid = '" + req.userId + "' AND ideaid = " + ideaid;
        console.log(sql);

        dbConnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if (err) {
                    res.json({ error: err })
                };
                amqp.connect('amqp://localhost', function(err, conn) {
                    conn.createChannel(function(err, ch) {
                        var q = 'VOTES';
                        var msg = '{"operation":"REFRESH_VOTES_IDEA","ideaid":' + ideaid + '}';
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
                console.log("Vote Deleted");
                logger.info("Vote Deleted");
            });
            res.end();
            connection.release();
        });

        logger.info("End Delete vote");
    });
};