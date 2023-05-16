const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');

const LikeItem = function (LikeItem) {
	this.item_ID = LikeItem.item_ID;
	this.user_ID = LikeItem.user_ID;;
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


LikeItem.LikeItem = async (req, res) => {
	if (!req.body.item_ID || req.body.item_ID === '') {
		res.json({
			message: "Please Enter item_ID",
			status: false,
		});
	} else if (!req.body.user_ID) {
		res.json({
			message: "Please Enter user_ID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.likeitems (
        id SERIAL,
        item_id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
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
				sql.query(`INSERT INTO likeitems (id, item_id , user_id, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') 
							RETURNING * `, [req.body.item_ID, req.body.user_ID], async (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {
						const user = await sql.query(`SELECT  "user".username FROM "likeitems" JOIN "user" 
						ON "likeitems".user_id = "user".id where "likeitems".user_id = $1 
						  `, [req.body.user_ID]);
						console.log(user.rows);

						const item = await sql.query(`SELECT  "items".name, "items".userid FROM "likeitems" JOIN "items" 
						  ON "likeitems".item_id = "items".id where "likeitems".item_id = $1 
							`, [req.body.item_ID]);

						const ItemUser = await sql.query(`SELECT * FROM "user" 
							 where "id" = $1 
							  `, [item.rows[0].userid]);
						console.log(user.rows);

						if (user.rows.length > 0) {

							sendNotificationToUser(ItemUser.rows[0].id, `${user.rows[0].username} Likes your Item (${item.rows[0].name}) `);


							console.log(user.rows[0].username);
							const data = await sql.query(`INSERT INTO  "notifications"
							 (id, user_id, notification_from , notification_message , createdAt ,updatedAt)
							 VALUES (DEFAULT, $1, $2, $3, 'NOW()', 'NOW()') 
							  `, [ItemUser.rows[0].id , req.body.user_ID, `${user.rows[0].username} Likes your Item (${item.rows[0].name}) `]);
							if (data.rows.length > 1) {
								res.json({
									message: "item Liked Successfully!",
									status: true,
									result: result.rows,
								});
							}
							else {
								res.json({
									message: "item Liked Successfully!",
									status: true,
									result: result.rows,
								});
							}
						} else {
							res.json({
								message: "item Liked Successfully!",
								status: true,
								result: result.rows,
							});
						}


					}
				})

			};
		});
	}
}

LikeItem.UnLikeItem = async (req, res) => {
	const data = await sql.query(`select * from likeitems where item_id = ${req.body.item_ID} 
	AND user_id = ${req.body.user_ID} `);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM likeitems WHERE item_id = $1 AND user_id = $2 ;`, [req.body.item_ID, req.body.user_ID], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "item un-like Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}

LikeItem.ViewLikeItem = async (req, res) => {
	const data = await sql.query(`select COUNT(*) AS count from "likeitems" where user_id = ${req.body.user_ID} 
	AND user_id = ${req.body.user_ID} `);

	sql.query(`SELECT  "user".username, "user".email , "user".phone,
	"user".country_code, "user".image AS User_Image ,"user".cover_image
	 AS Cover_Image ,"user".status ,
	"items".* FROM "likeitems" JOIN "user" 
	ON "likeitems".user_id = "user".id JOIN "items" ON  "items".id 
	= "likeitems".item_id where user_id = $1;`, [req.body.user_ID], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "item Details",
				status: true,
				AllLikes : data.rows[0].count,
				result: result.rows,
			});
		}
	});

}

LikeItem.ViewItemLikes = async (req, res) => {
	sql.query(`select COUNT(*) AS count from "likeitems" where item_id = $1 
	`,[req.body.item_ID] ,(err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "item likes",
				status: true,
				AllLikes : result.rows,
			});
		}
	});

}


module.exports = LikeItem;