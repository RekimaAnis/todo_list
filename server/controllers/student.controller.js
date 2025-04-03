const path = require('path');

class StudentController{
  getFirstPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/student.html'));
  };
}

module.exports = new StudentController();