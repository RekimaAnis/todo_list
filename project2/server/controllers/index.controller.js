const path = require('path');

class IndexController{
  getFirstPage = (req, res) => {
     res.sendFile(path.join(__dirname, '../public/index.html'));
  };
}

module.exports = new IndexController();