module.exports = app => {

    const Items = require("../controllers/Items");
    const upload = require("../middlewares/FolderImagesMulter")
    let router = require("express").Router();
    router.post("/add_items",upload.single('video'),  Items.Add);
    router.put("/add_item_images", upload.array('images'),  Items.addImages);
    router.put("/edit_item_image",upload.array('image'), Items.EditImages);
    router.delete("/delete_items", Items.Delete);
    router.delete("/delete_all_User", Items.DeleteAll_User);
    router.delete("/delete_all", Items.DeleteAll);

    router.post("/get_item", Items.GetItem);
    router.put("/update_items",upload.single('video'), Items.Update);
    router.post("/search_items_by_name", Items.search);
    router.get("/get_link/:item_id", Items.GetLink);
    router.post("/get_all_items", Items.GetAllItems);
    router.post("/get_items_by_category", Items.GetItemsByCategory);
    router.post("/get_items_by_user", Items.GetUserItems);
    router.post("/get_items_by_loc_id", Items.GetLocIDItems);
    router.post("/get_all_items_admin", Items.GetAllItems_Admin);
    app.use("/items", router);
};
