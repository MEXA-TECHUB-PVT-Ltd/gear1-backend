module.exports = app => {


    const Follow = require("../controllers/Follow");

    let router = require("express").Router();

    router.post("/follow_user", Follow.Follow);
    router.post("/get_followers",Follow.GetFollowers );
    router.post("/get_followings",Follow.GetFollowings );
    router.post("/check_follow_status",Follow.CheckStatus );

    app.use("/follow", router);
};
