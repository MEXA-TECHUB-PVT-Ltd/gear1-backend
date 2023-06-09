module.exports = app => {


    const Orders = require("../controllers/Orders");
    // const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_orders", Orders.Add);
    // router.put("/add_item_images", upload.array('images'),  Orders.addImages);
    router.put("/update_orders_status", Orders.changeOrderStatus);

    router.post("/get_all_orders", Orders.GetAll);
    router.post("/get_orders_by_marchandise_id", Orders.GetByMarchandiseID);
    router.post("/get_orders_by_status", Orders.GetByStatus);
    router.post("/get_orders_by_user_id", Orders.GetByUserID);
    router.post("/get_orders_by_user_id_status", Orders.GetUserOrders_ByStatus);
    // router.delete("/delete_orders", Orders.Delete);


    app.use("/orders", router);
};
