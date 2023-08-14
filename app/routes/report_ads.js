module.exports = app => {


    const report_ads = require("../controllers/report_ads");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_report", report_ads.Add);

    router.post("/get_a_report", report_ads.ViewSpecific);
    router.post("/get_all_reports", report_ads.ViewAll);
    router.post("/get_report_count", report_ads.getCount);
    router.post("/get_report_by_user_id", report_ads.reportBy_UserID);

    router.delete("/delete_report", report_ads.Delete);

    app.use("/report_ads", router);
};

