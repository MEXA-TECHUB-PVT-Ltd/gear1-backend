module.exports = app => {


    const DailyDeals = require("../controllers/DailyDeals");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_daily_deals", DailyDeals.Add);
    router.put("/add_dailydeals_image", upload.single('image'),  DailyDeals.addImages);
    router.put("/update_status", DailyDeals.UpdateStatus);
    router.put("/update_daily_deals", DailyDeals.Update);
    router.post("/get_a_daily_deals", DailyDeals.GetADailyDeal);
    router.post("/get_all_active_daily_deals", DailyDeals.GetAllActiveDeals);
    router.post("/get_all_daily_deals", DailyDeals.GetAllDailyDeals);

    // router.delete("/delete_dailydeals", DailyDeals.Delete);

    app.use("/dailydeals", router);
};
