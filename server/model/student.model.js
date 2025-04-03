const mongoose = require('mongoose');


/* bookdetail Schema*/
const studentSchema = new mongoose.Schema({
   number : {
      type : Number,
      required : true,
      unique : true
   },
   f_name : {
      type : String,
      required : true
   },
   l_name : {
    type : String,
    required : true
   }
});



// export the schema
module.exports = studentSchema;

// schema must be "compiled" into a model and "bound" to a collection of a database managed by a connection
const dbConnection = require('../controllers/db.controller');
const Student = dbConnection.model('Tasks',studentSchema,'tasks');

// export the model
module.exports.model = Student;
