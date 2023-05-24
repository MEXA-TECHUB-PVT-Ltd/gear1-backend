module.exports = app => {


    const Merchandise = require("../controllers/Merchandise");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_merchandise", Merchandise.Add);
    router.put("/add_merchandise_images", upload.array('images'),  Merchandise.addImages);
    router.put("/edit_merchandise_image",upload.array('image'), Merchandise.EditImages);

    router.delete("/delete_merchandise", Merchandise.Delete);
    router.post("/get_merchandise", Merchandise.GetMerchandise);
    router.put("/update_merchandise", Merchandise.Update);
    router.get("/get_all_merchandise", Merchandise.GetAllMerchandise);

    // router.post("/search_merchandise_by_name", Merchandise.search);
    // router.post("/get_merchandise_by_category", Merchandise.GetMerchandiseByCategory);
    // router.post("/get_merchandise_by_user", Merchandise.GetUserMerchandise);


    app.use("/merchandise", router);
};
