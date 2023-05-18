const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');

const RateUser = function (RateUser) {
	this.rate_by_user_ID = RateUser.rate_by_user_ID;
	this.user_ID = RateUser.user_ID;
	this.rating = RateUser.rating;

};


async function sendNotificationToUser(user_id, message) {
	try {
		const FCM_RESOURCE = 'https://fcm.googleapis.com/fcm/send';
		const FCM_SERVER_KEY = "AAAA4-XKjyY:APA91bHIrHfVf5p1_XLN68xBU2qEHDd-_NEGhiWqMt3oBv22GVX-HZpc7YUFz-JQ8dfA3sTkEup9kY70QrM4ewA2bqF7ciWSPRCkHaXUqvaqrDgQVr4_zuSL1ZhdxbHigp5d6s6XU-cL";
		let deviceToken = '';
		const user = await sql.query(`SELECT * FROM "user" 
		 where id = $1 
		  `, [user_id]);
		if (user.rows.length > 0) {
			deviceToken = user.rows[0].devicetoken;
		}

		// const result = await userModel.findOne({ id: user_id });
		// if (result) {
		// 	deviceToken = result.device_token;
		// }

		var data = JSON.stringify({
			to: deviceToken,
			collapse_key: 'type_a',
			notification: {
				title: "Notification received",
				body: message
			},
		});
		console.log(data)
		var config = {
			method: 'post',
			url: FCM_RESOURCE,
			headers: {
				Authorization: `key=${FCM_SERVER_KEY}`,
				'Content-Type': 'application/json',
			},
			data: data,
		};

		const response = await axios(config);
		console.log(response.data);
		if (response.data.results.length > 0) {
			return true
		}
		else {
			return false;
		}
	}
	catch (err) {
		console.log(err);
		return false;

	}
}



RateUser.RateUser = async (req, res) => {
	const user = await sql.query(`select * from "user" WHERE id = $1`
		, [req.body.user_ID])
	const merchandise = await sql.query(`select * from "user" WHERE id = $1`
		, [req.body.rate_by_user_ID])

	if (!req.body.rate_by_user_ID || req.body.rate_by_user_ID === '') {
		res.json({
			message: "Please Enter rate by User-ID",
			status: false,
		});
	} else if (!req.body.user_ID) {
		res.json({
			message: "Please Enter User-ID",
			status: false,
		});
	} else if (merchandise.rowCount > 0) {
		if (user.rowCount > 0) {
		sql.query(`CREATE TABLE IF NOT EXISTS public.rateusers (
        id SERIAL,
        rate_by_user_id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
		rating text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));  ` , (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				sql.query(`INSERT INTO rateusers (id, rate_by_user_id , user_id,rating, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3 ,'NOW()', 'NOW()') 
							RETURNING * `, [req.body.rate_by_user_ID, req.body.user_ID, req.body.rating], async (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {

						const user = await sql.query(`SELECT  "user".username FROM "rateusers" JOIN "user" 
						ON "rateusers".rate_by_user_id = "user".id where "rateusers".rate_by_user_id = $1 
						  `, [req.body.rate_by_user_ID]);
						if (user.rows.length > 1) {
							console.log(user.rows[0].username);

							sendNotificationToUser(req.body.user_ID, `${user.rows[0].username} rates you  : ${req.body.rating} `);



							const data = await sql.query(`INSERT INTO  "notifications"
							 (id, user_id, notification_from , notification_message , createdAt ,updatedAt)
							 VALUES (DEFAULT, $1  , $2,$3,'NOW()', 'NOW()') 
							  `, [req.body.user_ID, req.body.rate_by_user_ID, `${user.rows[0].username} rates you  : ${req.body.rating} `]);
							if (data.rows.length > 1) {
								res.json({
									message: "Rate User Successfully!",
									status: true,
									result: result.rows,
								});
							}
							else {
								res.json({
									message: "Rate User Successfully!",
									status: true,
									result: result.rows,
								});
							}
						} else {
							res.json({
								message: "Rate User Successfully!",
								status: true,
								result: result.rows,
							});
						}


					}

				})

			};
		});
	} else {
		res.json({
			message: "Entered User ID is not present",
			status: false,
		});
	}
} else {
	res.json({
		message: "Entered Rate by User-ID is not present",
		status: false,
	});
	}
}



RateUser.RatedUserList = (req, res) => {
	sql.query(`SELECT  "user".username, "user".email , "user".phone,
	"user".country_code, "user".image AS User_Image ,"user".cover_image
	 AS Cover_Image , "rateusers".rating AS Rating FROM "rateusers" JOIN "user" 
	ON "rateusers".rate_by_user_id = "user".id where "rateusers".user_id = $1;`
		, [req.body.user_ID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "User's Rated List",
					status: true,
					result: result.rows,
				});
			}
		});

}

module.exports = RateUser;