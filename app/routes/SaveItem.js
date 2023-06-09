module.exports = app => {


    const SaveItem = require("../controllers/SaveItem");

    let router = require("express").Router();

    router.post("/save_item", SaveItem.SaveItem);
    router.post("/un_save_item", SaveItem.UnSaveItem);
    router.post("/view_save_Item",SaveItem.ViewSaveItem );
    router.post("/check_item",SaveItem.CheckItem );

    app.use("/save_item", router);
};
