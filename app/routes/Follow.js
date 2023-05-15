module.exports = app => {


    const Follow = require("../controllers/Follow");

    let router = require("express").Router();

    router.post("/follow_user", Follow.Follow);
    router.post("/get_followers",Follow.GetFollowers );
    router.post("/get_followings",Follow.GetFollowings );

    app.use("/follow", router);
};
