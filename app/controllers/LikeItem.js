const LikeItem = require("../models/LikeItem");

// Create and Save a new Admin
exports.LikeItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  LikeItem.LikeItem( req, res);
};
exports.UnLikeItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  LikeItem.UnLikeItem( req, res);
};

exports.ViewLikeItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  LikeItem.ViewLikeItem( req, res);
};
// exports.ViewLikeItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   LikeItem.ViewLikeItem( req, res);
// };


// exports.viewSpecificLikeItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   LikeItem.viewSpecific( req, res);
// };

