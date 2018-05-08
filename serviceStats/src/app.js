var amqp = require('amqplib/callback_api');

const winston = require('winston');
var logger = require('./config/log');
var Stat = require('./models/Stat');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'VOTES';

        ch.assertQueue(q, { durable: true });
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            var str = msg.content.toString();
            var message = JSON.parse(str);
            if (message.operation == 'REFRESH_VOTES_IDEA') {
                Stat.updatestatbyidea(message.ideaid);
            }
            if (message.operation == 'REFRESH_VOTES_USER') {
                Stat.updatestatbyidea(message.userid);
            }
            console.log(message.operation);
            console.log(" [x] Received %s", msg.content.toString());
            //setTimeout(function() {


            //}, secs * 1000);
            logger.info("End update votes");
            console.log(" [x] Done");
            ch.ack(msg);
        }, { noAck: false });
    });
});