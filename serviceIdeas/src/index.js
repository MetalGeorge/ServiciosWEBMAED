const app = require('./config/server');
const winston = require('winston');
var logger = require('./config/log');

  require('./app/routes/controller')(app);
  require('./app/routes/controllervotes')(app);

// starting the server
app.listen(app.get('port'), () => {
  console.log('Express server for Ideas listening on port', app.get('port'));
   logger.info("Express server for Ideas listening on port" + app.get('port'));
});
