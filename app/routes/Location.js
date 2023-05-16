module.exports = app => {


    const Location = require("../controllers/Location");
    // const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add_location", Location.Add);
    router.put("/update_location", Location.Update);

    // router.delete("/delete_location", Location.Delete);
    router.post("/view_a_location", Location.ViewALocation);
    router.post("/view_all_location", Location.ViewAllLocation);
    router.post("/view_all_location_user", Location.ViewAllLocationUser);


    app.use("/location", router);
};
