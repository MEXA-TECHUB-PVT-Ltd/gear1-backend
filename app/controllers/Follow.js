const Follow = require("../models/Follow");

// Create and Save a new Admin
exports.Follow = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Follow.Follow( req, res);
};


exports.CheckStatus = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Follow.CheckStatus( req, res);
};


exports.GetFollowers = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Follow.GetFollowers( req, res);
};

exports.GetFollowings = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Follow.GetFollowings( req, res);
};
