module.exports = app => {


    const Ads = require("../controllers/Ads");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_ad", Ads.Add);
    router.put("/add_ad_image", upload.single('image'),  Ads.addImage);

    router.delete("/delete_ad", Ads.Delete);
    router.post("/get_a_ad", Ads.Get);
    router.post("/get_all_Ads", Ads.GetAll);
    router.post("/get_Ads_by_screen", Ads.GetByScreen);
    router.put("/update_ad", Ads.Update);
    router.put("/update_status", Ads.UpdateStatus);
    router.post("/get_active_Ads_by_screen", Ads.GetActiveByScreen);


    app.use("/ads", router);
};
