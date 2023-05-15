const ShareItem = require("../models/ShareItem");

// Create and Save a new Admin
exports.ShareItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  ShareItem.ShareItem( req, res);
};
exports.UnShareItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  ShareItem.UnShareItem( req, res);
};

exports.ViewShareItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  ShareItem.ViewShareItem( req, res);
};
// exports.ViewShareItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   ShareItem.ViewShareItem( req, res);
// };


// exports.viewSpecificShareItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   ShareItem.viewSpecific( req, res);
// };

