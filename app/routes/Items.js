module.exports = app => {


    const Items = require("../controllers/Items");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_items", Items.Add);
    router.put("/add_item_images", upload.array('images'),  Items.addImages);

    router.delete("/delete_items", Items.Delete);
    router.post("/get_item", Items.GetItem);
    router.put("/update_items", Items.Update);
    router.post("/search_items_by_name", Items.search);
    router.post("/get_all_items", Items.GetAllItems);
    router.post("/get_items_by_category", Items.GetItemsByCategory);
    router.post("/get_items_by_user", Items.GetUserItems);


    app.use("/items", router);
};
