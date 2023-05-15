module.exports = app => {


    const ShareItem = require("../controllers/ShareItem");

    let router = require("express").Router();

    router.post("/share_item", ShareItem.ShareItem);
    router.post("/un_share_item", ShareItem.UnShareItem);
    router.post("/view_share_Item",ShareItem.ViewShareItem );

    app.use("/share_item", router);
};
