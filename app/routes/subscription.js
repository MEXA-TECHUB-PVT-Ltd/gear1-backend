module.exports = app => {

const subscriptionPlan = require("../controllers/subscriptionPlan");

let router = require("express").Router();

router.post("/add_subscription_plan", subscriptionPlan.create);
router.post("/view_a_specific_subscription_plan", subscriptionPlan.viewSpecificPlan);
router.get("/view_subscription_plan", subscriptionPlan.viewAllPlans);
router.put("/update_subscription_plan", subscriptionPlan.update);
router.delete("/delete_specific_subscription_plan/:id" , subscriptionPlan.delete)

router.post("/avail_subscription" , subscriptionPlan.AvailSubscription)
router.get("/view_subscription_plan_user", subscriptionPlan.ViewSubscriptionPlanUser);
router.post("/view_subscription_plan_specific_user", subscriptionPlan.ViewSubscriptionPlanSpecificUser);





app.use("/Subscription", router);
};
