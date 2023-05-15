module.exports = app => {

  const imgToPdf = require("../controllers/imgToPdf");

  const upload = require("../middlewares/FolderImagesMulter")

  let router = require("express").Router();

  
  router.post("/convert_images_to_pdf", upload.array('images'), imgToPdf.imgToPdf);
  router.get("/get_all_images_to_pdf", imgToPdf.getAllImagePdf);
  router.get("/get_all_images_to_pdf_count", imgToPdf.getAllImagePdfCount);
  router.get("/get_all_images_to_pdf_count_monthly", imgToPdf.getAllImgPdf_MonthWise_count);
  router.get("/get_all_img_to_pdf_year", imgToPdf.getAllImgToPdfYear);


  app.use("/imgToPdf", router);
};
