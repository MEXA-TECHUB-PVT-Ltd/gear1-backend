module.exports = app => {

  const pdf = require("../controllers/pdf");

  const upload = require("../middlewares/FolderImagesMulter")

  let router = require("express").Router();

  router.post("/lock_pdf", upload.array('pdf'), pdf.lockPdf);
  router.post("/unlock_pdf", upload.array('pdf'), pdf.unlockPdf);
  router.post("/merge_pdfs", upload.array('pdf'), pdf.mergePdf);
  router.get("/get_all_pdf",  pdf.getAllPDF);
  router.get("/get_all_merged_pdf",  pdf.getAllMergedPDF);
  router.get("/get_all_pdf_count",  pdf.getAllPDFCount);
  router.get("/get_all_merged_pdf_count",  pdf.getAllMergedPDFCount);

  router.get("/get_all_merged_pdf_count_monthly",  pdf.getMergedPdf_MonthWise_count);
  router.post("/get_all_pdf_count_monthly",  pdf.getAllPdf_MonthWise_count);

  router.get("/get_all_pdf_year",  pdf.getAllPdfYear);
  router.get("/get_all_merged_pdf_year",  pdf.getAllMergedPdfYear);




  app.use("/pdf", router);
};
