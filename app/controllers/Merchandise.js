const Merchandise = require("../models/Merchandise");


exports.Add = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.Add( req, res);
};
exports.Delete = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.Delete( req, res);
};

exports.Update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.Update( req, res);
};

exports.addImages = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.addImages( req, res);
};

exports.GetMerchandise = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.GetMerchandise( req, res);
};

exports.GetAllMerchandise = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Merchandise.GetAllMerchandise( req, res);
};

// exports.GetUserMerchandise = (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   Merchandise.GetUserMerchandise( req, res);
// };


// exports.GetMerchandiseByCategory = (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   Merchandise.GetMerchandiseByCategory( req, res);
// };


// exports.search = (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   Merchandise.search( req, res);
// };