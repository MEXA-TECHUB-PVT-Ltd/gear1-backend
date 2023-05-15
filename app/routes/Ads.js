module.exports = app => {


    const Ads = require("../controllers/Ads");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_ad", Ads.Add);
    router.put("/add_ad_image", upload.single('image'),  Ads.addImage);

    router.delete("/delete_ad", Ads.Delete);
    router.post("/get_a_ad", Ads.Get);
    router.post("/get_all_ads", Ads.GetAll);
    router.post("/get_ads_by_screen", Ads.GetByScreen);
    router.put("/update_ad", Ads.Update);


    app.use("/ads", router);
};
