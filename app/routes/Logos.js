module.exports = app => {


    const Logos = require("../controllers/Logos");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_logos", Logos.Add);
    router.put("/add_logos_image", upload.single('image'),  Logos.addImage);

    router.delete("/delete_logo", Logos.Delete);
    router.post("/get_a_logos", Logos.Get);
    router.post("/get_all_logos", Logos.GetAll);
    router.post("/get_logos_by_screen", Logos.GetByScreen);
    router.post("/get_active_logos_by_screen", Logos.GetActiveByScreen);
    router.put("/update_logos", Logos.Update);
    router.put("/update_logo_status", Logos.Update);


    app.use("/logos", router);
};
