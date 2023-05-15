module.exports = app => {


    const LikeItem = require("../controllers/LikeItem");

    let router = require("express").Router();

    router.post("/like_item", LikeItem.LikeItem);
    router.post("/un_like_item", LikeItem.UnLikeItem);
    router.post("/view_like_Item",LikeItem.ViewLikeItem );

    app.use("/like_item", router);
};
