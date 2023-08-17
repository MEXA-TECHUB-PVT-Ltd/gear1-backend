module.exports = app => {
    const Auth = require("../controllers/auth");
  
    var router = require("express").Router();
    const upload = require("../middlewares/FolderImagesMulter")


    router.post("/sign_in", Auth.signIn);
    router.post("/google_sign_in", Auth.GooglesignIn);
    router.post("/sign_up", Auth.signUp);
    router.put("/update_profile", Auth.updateProfile);
    router.put("/change_number", Auth.ChangeNumber);
    router.put("/add_image", upload.single('image'),  Auth.addImage);
    router.put("/add_cover_image", upload.single('image'),  Auth.addCoverImage);
    router.put("/resetPassword", Auth.passwordReset);
    router.post("/verifyEmail", Auth.verifyEmail);
    router.post("/verifyOTP", Auth.verifyOTP)
    router.post("/newPassword", Auth.newPassword)
    router.get("/all_users", Auth.AllUsers)
    router.get("/specific_user/:id", Auth.SpecificUser)
    router.delete("/delete_user/:id", Auth.DeleteUser)
    router.get("/totay_added_users", Auth.todaysAddedUsers)
    router.post("/get_history", Auth.getHistory)

    router.get("/total_users", Auth.TotalUsers)
    router.post("/get_monthwise_users", Auth.getAllUsers_MonthWise_count)
    router.get("/get_years", Auth.getYears)

    router.get("/subscribed_user_count", Auth.SubscribedUserCount)
    router.get("/subscribed_users", Auth.SubscribedUsers)

    router.get("/block_users_count", Auth.BlockUserCount)
    router.get("/block_users", Auth.BlockUsers)


    app.use('/auth', router);
  };


// module.exports = app => {
//     const signIn = require("../controllers/auth/signIn");
//     const signUp = require("../controllers/auth/signUp");
//     const passwordReset = require("../controllers/auth/passwordReset");
//     const newPassword = require("../controllers/auth/newPassword");
//     const verifyEmail = require("../controllers/auth/VerifyEmail");
//     const verifyOTP = require("../controllers/auth/verifyOTP");
//     const AllUsers = require("../controllers/auth/AllUsers");
//     const SpecificUser = require("../controllers/auth/SpcificUser");
//     const DeleteUser = require("../controllers/auth/DeleteUser");

//     let router = require("express").Router();


//     app.use("/auth", router);
// };
