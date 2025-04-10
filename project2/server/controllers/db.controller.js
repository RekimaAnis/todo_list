const mongoose = require('mongoose');

const dbURI = require('../config/db.config').DB_URI;
// connect to database
const dbConnection = mongoose.createConnection(dbURI);

// export connection
module.exports = dbConnection;


dbConnection.on('connected',
  () => console.log(`db.controller.js : connected to ${dbURI}`)
);
dbConnection.on('disconnected',
  () => console.log(`db.controller.js : disconnected from ${dbURI}`)
);
dbConnection.on('error',
  err => console.log(`db.controller.js : connection error ${err} `)
);


//
// "clean"  management of connection end
//
const shutdown = async msg => {
  await dbConnection.close();
  console.log(` Mongoose shutdown : ${msg}`);
  process.exit(0);
}

// code pour gérer proprement le Ctrl+C sous windows et la réception de 'SIGINT'
// nécessite d'installer  le module readline :
//                           'npm install readline --save'
const readline = require('readline');
if (process.platform === 'win32') {
    readline
      .createInterface({
        input: process.stdin,
        output: process.stdout
      })
      .on('SIGINT', function() {
        process.emit('SIGINT');
      })
  };

// application killed (ctrl+c)
process.on('SIGINT', () => shutdown('application ends') );
// process killed (POSIX)
process.on('SIGTERM', () =>  shutdown('SIGTERM received') );
