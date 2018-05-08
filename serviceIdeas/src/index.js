const app = require('./config/server');
const winston = require('winston');
var dbConnection = require('./config/dbConnection').pool;
var logger = require('./config/log');
var amqp = require('amqplib/callback_api');
var amqp2 = require('amqplib/callback_api');
require('./app/routes/controller')(app);
require('./app/routes/controllervotes')(app);

// colas

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'USERS';
        ch.assertQueue(q, { durable: true });
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            var str = msg.content.toString();
            var message = JSON.parse(str);
            if (message.operation == 'DELETE_USER') {
                // enviar a borrar votos usuario
                var sql = "DELETE FROM dbideas.votes WHERE userid = '" + message.userid + "'";
                dbConnection.getConnection(function(err, connection) {
                    connection.query(sql, function(err, result) {
                        console.log("Votes Deleted");
                        logger.info("Votes Deleted");
                    });
                    connection.release();
                });

                logger.info("End Delete vote");
                amqp2.connect('amqp://localhost', function(err, conn) {
                    conn.createChannel(function(err, ch) {
                        var q = 'VOTES';
                        var msg = '{"operation":"REFRESH_VOTES_USER","userid":"' + message.userid + '"}';
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
            }
            console.log(message.operation);
            console.log(" [x] Received %s", msg.content.toString());

            logger.info("End update votes");
            console.log(" [x] Done");
            ch.ack(msg);
        }, { noAck: false });
    });
});
// starting the server
app.listen(app.get('port'), () => {
    console.log('Express server for Ideas listening on port', app.get('port'));
    logger.info("Express server for Ideas listening on port" + app.get('port'));
});