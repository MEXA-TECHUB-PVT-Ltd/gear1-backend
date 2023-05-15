module.exports = app => {


    const Notifications = require("../controllers/Notifications");

    let router = require("express").Router();

    router.post("/rate_user_notification_list", Notifications.rateUser);
    router.post("/like_item_notification_list", Notifications.likeItem);
    router.post("/follow_user_notification_list",Notifications.FollowUser );

    app.use("/notifications", router);
};
