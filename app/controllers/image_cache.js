const image_cache = require("../models/image_cache");

exports.addImage = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  image_cache.addImage( req, res);
};
exports.Update = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  image_cache.Update( req, res);
};
exports.GetAll = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  image_cache.GetAll( req, res);
};
exports.GetOne = (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  image_cache.GetOne( req, res);
};
exports.Delete= (req, res) => {
  if (!req.body) {
    res.json({
      message: "Content can not be empty!",
      status: false,
     });
  }  
  image_cache.Delete( req, res);
};