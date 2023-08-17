const Image_Cache = require("../models/Image_Cache");

exports.addImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Image_Cache.addImage( req, res);
};
exports.Update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Image_Cache.Update( req, res);
};
exports.GetAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Image_Cache.GetAll( req, res);
};
exports.GetOne = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Image_Cache.GetOne( req, res);
};
exports.Delete= (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  Image_Cache.Delete( req, res);
};