const SaveItem = require("../models/SaveItem");

// Create and Save a new Admin
exports.SaveItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  SaveItem.SaveItem( req, res);
};
exports.UnSaveItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  SaveItem.UnSaveItem( req, res);
};

exports.CheckItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  SaveItem.CheckItem( req, res);
};

exports.ViewSaveItem = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  SaveItem.ViewSaveItem( req, res);
};
// exports.ViewSaveItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   SaveItem.ViewSaveItem( req, res);
// };


// exports.viewSpecificSaveItem= (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   SaveItem.viewSpecific( req, res);
// };

