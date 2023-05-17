module.exports = app => {


    const Categories = require("../controllers/Categories");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_category", Categories.Add);
    router.put("/add_category_image", upload.single('image'),  Categories.addImage);

    router.put("/update_category", Categories.Update);
    router.delete("/delete_category/:id", Categories.Delete);
    router.post("/get_category", Categories.GetCategories);
    router.get("/get_all_category", Categories.GetAllCategories);

    app.use("/category", router);
};