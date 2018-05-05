const app = require('./config/server');

require('./app/routes/controller')(app);

// starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});
