module.exports = app => {


    const report_items = require("../controllers/report_items");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_report", report_items.Add);

    router.post("/get_a_report", report_items.ViewSpecific);
    router.post("/get_all_reports", report_items.ViewAll);
    router.post("/get_report_count", report_items.getCount);
    router.post("/get_report_by_user_id", report_items.reportBy_UserID);

    router.delete("/delete_report", report_items.Delete);

    app.use("/report_items", router);
};

