const Student = require('../model/student.model').model;


const allStudent = async (req, res) => {
   try {
      const students = await Student.find();
      res.status(200).json(students);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}


const addStudent = async (req, res) => {
   try {
      const { name, firstname, number } = req.body;
      const newStudent = new Student({
         l_name: name.toUpperCase(),
         f_name: firstname, 
         number
      });
      await newStudent.save();
      res.status(201).json(newStudent);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}


const updateStudent = async (req, res) => {
   try {
      const { name, firstname } = req.body;
      const studentId = req.params.id;

      const updatedStudent = await Student.findByIdAndUpdate(
         studentId,
         {
            l_name: name.toUpperCase(),
            f_name: firstname
         },
         { new: true }
      );
      if (!updatedStudent) {
         return res.status(404).json({ error: 'Étudiant non trouvé' });
      }
      res.status(200).json(updatedStudent);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}


const deleteStudent = async (req, res) => {
   try {
      await Student.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Étudiant supprimé' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

module.exports.allStudent = allStudent;
module.exports.addStudent = addStudent;
module.exports.updateStudent = updateStudent;
module.exports.deleteStudent = deleteStudent;
