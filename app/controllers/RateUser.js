const RateUser = require("../models/RateUser");

// Create and Save a new Admin
exports.RateUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  RateUser.RateUser( req, res);
};


exports.RatedUserList = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  RateUser.RatedUserList( req, res);
};
