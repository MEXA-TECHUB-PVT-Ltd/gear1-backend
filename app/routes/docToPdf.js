module.exports = app => {

  const docToPdf = require("../controllers/docToPdf");

  const upload = require("../middlewares/FolderImagesMulter")

  let router = require("express").Router();

  router.post("/convert_doc_to_pdf", upload.array('word'), docToPdf.docToPdf);


  app.use("/docToPdf", router);
};
