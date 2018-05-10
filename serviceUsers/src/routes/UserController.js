var VerifyToken = require('./VerifyToken');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var amqp = require('amqplib/callback_api');
var logger = require('../config/log');


// CREATES A NEW USER
router.post('/register', function(req, res) {
    logger.info("Begin Register User");
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        },
        function(err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
                // create a token
            var token = jwt.sign({ id: user._id, name: user.name }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
            logger.info("End Register User");
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, function(req, res, next) {
    logger.info("Begin List Users");
    User.find({}, function(err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
        logger.info("End List Users");
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/user/:id', VerifyToken, function(req, res, next) {
    logger.info("Begin List User");
    User.findById(req.params.id, function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
        logger.info("End List User");
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/', VerifyToken, function(req, res, next) {
    logger.info("Begin Delete User");
    const { id } = req.body;
    User.findByIdAndRemove(id, function(err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
        logger.info("End Delete User");
        amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
                var q = 'USERS';
                var msg = '{"operation":"DELETE_USER","userid":"' + id + '"}';
                ch.assertQueue(q, { durable: true });
                ch.sendToQueue(q, new Buffer(msg), { persistent: true });
                console.log(" [x] Sent '%s'", msg);
                logger.info(" [x] Sent '%s'", msg);
                conn.close();
            });
        });

    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function(req, res) {
    logger.info("Begin Update User");
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
    logger.info("End Update User");
});
// LOGIN
router.post('/login', function(req, res) {
    logger.info("Begin Login User");
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id, name: user.name }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
        logger.info("End Login User");
    });
});

//
router.get('/me', VerifyToken, function(req, res, next) {
    logger.info("Begin me");
    User.findById(req.userId, { password: 0 }, function(err, user) {

        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
        logger.info("End me");
    });
});

// add the middleware function
router.use(function(user, req, res, next) {
    res.status(200).send(user);
});

module.exports = router;