const Groups = require('../model/groups.model').model;
const Student = require('../model/student.model').model;

// define a REST like API available for route/Groups

// controller for GET /
const allGroups =
   async (req, res) => {
      try{
         const allGroups = await Groups.find().populate('student');
         res.status(200).json(allGroups);
      } 
      catch(err){
         res.status(500).json({error : err.message} );
      } 
   }

const getStudentInGroup = async (req,res) =>{
   try{
      const groupNumber = parseInt(req.params.groupNumber);
      const groupAssignments = await Groups.find({groups : groupNumber}).populate('student');
      const students = groupAssignments.map(g => g.student);
      res.status(200).json(students);
   } catch(err){
      res.status(500).json({error : err.message} )
   }
} 

const getStudentWithoutGroup = async (req,res) =>{
   try{
      const studentsWithGroup = await Groups.distinct('student');

      const allStudent = await Student.find({
         _id:{$nin : studentsWithGroup} 
      });
      res.status(200).json(allStudent);
   } catch(err){
      res.status(500).json({error : err.message} )
   }
} 

const assignStudentToGroup = async (req, res) => {
   try {
      const { studentId, groupNumber } = req.body;
      
      if (!studentId || !groupNumber) {
         return res.status(400).json({ error: "studentId et groupNumber sont requis" });
      }
      
      // Check if student already has a group
      const existingAssignment = await Groups.findOne({ student: studentId });
      if (existingAssignment) {
         return res.status(400).json({ error: "Cet étudiant est déjà assigné à un groupe" });
      }
      
      const newAssignment = new Groups({
         student: studentId,
         groups: groupNumber
      });
      
      await newAssignment.save();
      res.status(201).json(newAssignment);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

const removeFromGroup = async(req, res) =>{
   try{
      const studentId = req.params.studentId;

      const result = await Groups.findOneAndDelete({student : studentId});
      if(!result){
         return res.status(404).json({error : "pas d'étudiant trouvé"} );
      }
      res.status(200).json({message : "Etudiant retiré du groupe"});
   } 
   catch (err) {
      res.status(500).json({ error: err.message });
   }
}

module.exports.allGroups = allGroups;
module.exports.getStudentInGroup = getStudentInGroup;
module.exports.getStudentWithoutGroup =  getStudentWithoutGroup;
module.exports.assignStudentToGroup = assignStudentToGroup;
module.exports.removeFromGroup = removeFromGroup;