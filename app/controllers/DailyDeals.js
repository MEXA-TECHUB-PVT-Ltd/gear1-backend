const DailyDeals = require("../models/DailyDeals");

// Create and Save a new Admin
exports.Add = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.Add( req, res);
};
// exports.Delete = (req, res) => {
//   if (!req.body) {
//     res.json({
//       message: "Content can not be empty!",
//       status: false,
//      });
//   }  
//   DailyDeals.Delete( req, res);
// };

exports.Update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.Update( req, res);
};

exports.GetADailyDeal = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.GetADailyDeal( req, res);
};

exports.GetAllDailyDeals = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.GetAllDailyDeals( req, res);
};

exports.GetAllActiveDeals = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.GetAllActiveDeals( req, res);
};

exports.UpdateStatus = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.UpdateStatus( req, res);
};

exports.addImages = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  DailyDeals.addImages( req, res);
};
