var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'events2';

        ch.assertExchange(ex, 'fanout', { durable: true });

        ch.assertQueue('VOTES', { exclusive: true }, function(err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, 'VOTES');

            ch.consume(q.queue, function(msg) {
                console.log(" [x] %s", msg.content.toString());
            }, { noAck: true });
        });
    });
});