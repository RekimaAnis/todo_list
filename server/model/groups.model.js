const mongoose = require('mongoose');


/* bookdetail Schema*/
const groupsSchema = new mongoose.Schema({
   student : {
      type : ObjectId,
      required : true,
   },
   groups : {
      type : Number,
      required : true,
      min : 1,
      max : 6
   }
});



// export the schema
module.exports = groupsSchema;

// schema must be "compiled" into a model and "bound" to a collection of a database managed by a connection
const dbConnection = require('../controllers/db.controller');
const Groups = dbConnection.model('Groups',groupsSchema,'groups');

// export the model
module.exports.model = Groups;
