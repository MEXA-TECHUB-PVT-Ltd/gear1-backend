module.exports = app => {


    const Image_Cache = require("../controllers/Image_Cache");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add", upload.single('image'),  Image_Cache.addImage);
    router.put("/update",upload.single('image'), Image_Cache.Update);
    router.delete("/delete/:id", Image_Cache.Delete);
    router.post("/get", Image_Cache.GetOne);
    router.post("/get_all", Image_Cache.GetAll);

    app.use("/image_cache", router);
};
