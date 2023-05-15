module.exports = app => {


    const SocialMedia = require("../controllers/SocialMedia");

    let router = require("express").Router();

    router.post("/add_social_media", SocialMedia.Add);
    router.delete("/delete_social_media", SocialMedia.Delete);
    router.post("/get_social_media", SocialMedia.Get);
    router.put("/update_social_media", SocialMedia.Update);


    app.use("/SocialMedia", router);
};
