module.exports = app => {


    const image_cache = require("../controllers/image_cache");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add", upload.single('image'),  image_cache.addImage);
    router.put("/update",upload.single('image'), image_cache.Update);
    router.delete("/delete/:id", image_cache.Delete);
    router.post("/get", image_cache.GetOne);
    router.post("/get_all", image_cache.GetAll);

    app.use("/image_cache", router);
};
