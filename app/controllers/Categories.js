const Categories = require("../models/Categories");

// Create and Save a new Admin
exports.Add = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.Add( req, res);
};
exports.addImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.addImage( req, res);
};
exports.GetActiveBannersCategories = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.GetActiveBannersCategories( req, res);
};
exports.Update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.Update( req, res);
};
exports.GetAll_only_Categories = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.GetAll_only_Categories( req, res);
};
exports.Delete= (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.Delete( req, res);
};
exports.GetAllCategories = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.GetAllCategories( req, res);
};
exports.GetCategories = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Categories.GetCategories( req, res);
};
