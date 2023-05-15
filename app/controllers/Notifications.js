const Notifications = require("../models/Notifications");

// Create and Save a new Admin
exports.rateUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Notifications.rateUser( req, res);
};
exports.likeItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Notifications.likeItem( req, res);
};

exports.FollowUser = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Notifications.FollowUser( req, res);
};
