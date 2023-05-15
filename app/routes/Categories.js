module.exports = app => {


    const Categories = require("../controllers/Categories");

    let router = require("express").Router();

    router.post("/add_category", Categories.Add);
    router.put("/update_category", Categories.Update);
    router.delete("/delete_category/:id", Categories.Delete);
    router.post("/get_category", Categories.GetCategories);
    router.get("/get_all_category", Categories.GetAllCategories);

    app.use("/category", router);
};
