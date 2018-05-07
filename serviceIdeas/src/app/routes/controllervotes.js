var VerifyToken = require('./VerifyToken');
const dbConnection = require('../../config/dbConnection');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');

module.exports = app => {

  const connection = dbConnection();

  app.use(function(idea, req, res, next) {
    res.status(200).send(idea);
  });

  app.get('/votes', VerifyToken, (req, res) => {
    connection.query('SELECT * FROM dbideas.votes ORDER BY id', (err, result) => {
      res.json(result);
    });
  });

  app.post('/votes', VerifyToken, (req, res) => {
    console.log(req);
    console.log(req.body);

    const { voterid, ideaid } = req.body;
    
    var sql = "INSERT INTO dbideas.votes (voterid, ideaid) VALUES ('"+voterid+"', "+ideaid+");";
        console.log(sql);

        connection.query(sql
        , function(err, result) {
          if (err) {
            res.json({ error: err })
          };
            console.log("1 record inserted");
        });
      res.end();   
  });

  app.delete('/votes', VerifyToken, (req, res) => {
    console.log(req);
    console.log(req.body);

    const { voterid, ideaid } = req.body;
    
    var sql = "DELETE FROM dbideas.votes WHERE voterid = '"+voterid+"' OR ideaid = "+ideaid;
        console.log(sql);

        connection.query(sql
        , function(err, result) {
          if (err) {
            res.json({ error: err })
          };
            console.log("record deleted");
        });
      res.end();   
  });
};
