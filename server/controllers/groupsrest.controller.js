const Groups = require('../model/Groups.model').model;

// define a REST like API available for route/Groups

// controller for GET /
const allStudent =
   async (req, res) => {
      const allStudent = await Groups.find();
      res.status(200).json(allStudent);
   }

// controller for POST /
const addStudent =
   async (req, res) => {
      const {name, firstname, number} = req.body ;
      const newStudent = new Groups({name, firstname, number});
      await newStudent.save();
      res.status(201).json(newStudent);
   }

//controller for POST/
const updateStudent = 
   async(req, res) => {
    const {name, firstname} = req.body;
    const updateStudent = new Groups({name, firstname});
    await updateStudent.save();
    res.status(201).json(updateStudent);
   }


// controller for DELETE /:bookId
const deleteStudent =
   async (req, res) => {
      await Tasks.findByIdAndDelete(req.params.id);
      res.status(200).json(null);
   }

module.exports.allStudent = allStudent;
module.exports.addStudent = addStudent;
module.exports.updateStudent =  updateStudent;
module.exports.deleteStudent = deleteStudent;
