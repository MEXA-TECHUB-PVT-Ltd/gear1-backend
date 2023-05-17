module.exports = app => {


    const LikeItem = require("../controllers/LikeItem");

    let router = require("express").Router();

    router.post("/like_item", LikeItem.LikeItem);
    router.post("/un_like_item", LikeItem.UnLikeItem);
    router.post("/view_like_Item",LikeItem.ViewLikeItem );
    router.post("/view_Item_likes",LikeItem.ViewItemLikes );

    app.use("/like_item", router);
};
