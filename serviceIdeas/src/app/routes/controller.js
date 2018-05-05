const dbConnection = require('../../config/dbConnection');

module.exports = app => {

  const connection = dbConnection();

  app.get('/ideas', (req, res) => {
    connection.query('SELECT * FROM dbideas.ideas ORDER BY id', (err, result) => {
      res.json(result);
    });
  });

  app.post('/ideas', (req, res) => {
    console.log(req);
    console.log(req.body);

    const { idea, proposername, votes } = req.body;
    

    var sql = "INSERT INTO dbideas.ideas (idea, proposername, votes) VALUES('idea', 'proposername', 0);";
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
};