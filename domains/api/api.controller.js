
let httpStatus = require('http-status');

/* GET /api/v1/ */
function root(req, res){
  res.status(httpStatus.OK).json({msg: 'ok'});
}

module.exports = {
  root
}