module.exports = app => {


    const RateUser = require("../controllers/RateUser");

    let router = require("express").Router();

    router.post("/rate_user", RateUser.RateUser);
    router.post("/rated_users_list",RateUser.RatedUserList );

    app.use("/rate_user", router);
};
