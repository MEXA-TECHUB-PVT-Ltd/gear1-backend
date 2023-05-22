const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Notifications = function (Notifications) {
	this.item_ID = Notifications.item_ID;
	this.user_ID = Notifications.user_ID;;
};



Notifications.rateUser = (req, res) => {
	sql.query(`SELECT * FROM notifications WHERE user_id = $1 ORDER BY "createdat" DESC ;`,[req.body.user_id], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All Notifications",
				status: true,
				result: result.rows
			});
		}
	});
}


Notifications.FollowUser = (req, res) => {
	sql.query(`SELECT * FROM notifications WHERE user_id = $1;`,[req.body.user_id], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Rate Notifications",
				status: true,
				result: result.rows
			});
		}
	});
}


Notifications.likeItem = (req, res) => {
	sql.query(`SELECT * FROM notifications WHERE user_id = $1;`,[req.body.user_id], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Rate Notifications",
				status: true,
				result: result.rows
			});
		}
	});
}



module.exports = Notifications;