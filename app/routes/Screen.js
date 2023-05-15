module.exports = app => {


    const Screen = require("../controllers/Screen");

    let router = require("express").Router();

    router.post("/add_screen", Screen.Add);
    router.put("/update_screen", Screen.Update);
    router.delete("/delete_screen/:id", Screen.Delete);
    router.post("/get_screen", Screen.GetScreen);
    router.get("/get_all_screen", Screen.GetAllScreen);

    app.use("/screen", router);
};
