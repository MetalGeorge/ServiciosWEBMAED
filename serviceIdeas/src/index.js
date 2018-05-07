const app = require('./config/server');
const winston = require('winston');


 var logger = new (winston.Logger)({
    transports: [
      new winston.transports.File({ filename: './logs/info-logs.log' })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: './logs/exceptions.log' })
    ]
  });

require('./app/routes/controller')(app);

// starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
  winston.log('info', 'Hello log files!', {
  someKey: 'some-value'
	});
});
