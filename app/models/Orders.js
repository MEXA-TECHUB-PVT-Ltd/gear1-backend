const { sql } = require("../config/db.config");

const Orders = function (Orders) {
	this.user_id = Orders.user_id
	this.merchandise_id = Orders.merchandise_id;
	this.ordered_at = Orders.ordered_at;
	this.status = Orders.status;

};

Orders.Add = async (req, res) => {
	const user = await sql.query(`select * from "user" WHERE id = $1`
		, [req.body.user_id])
	const merchandise = await sql.query(`select * from merchandise WHERE id = $1`
		, [req.body.merchandise_id])

	if (!req.body.user_id || req.body.user_id === '') {
		res.json({
			message: "Please Enter user_id",
			status: false,
		});
	} else if (merchandise.rowCount > 0) {
		if (user.rowCount > 0) {
			sql.query(`CREATE TABLE IF NOT EXISTS public.orders (
        id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        merchandise_id SERIAL NOT NULL,
		ordered_at text,
        status text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , (err, result) => {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					sql.query(`INSERT INTO orders (id, user_id , merchandise_id,ordered_at,status, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3, $4,  'NOW()', 'NOW()') RETURNING * `
						, [req.body.user_id, req.body.merchandise_id, req.body.ordered_at,
						req.body.status], (err, result) => {
							if (err) {

								res.json({
									message: "Try Again",
									status: false,
									err
								});
							}
							else {
								const History =  sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, action_table ,createdAt ,updatedAt )
								VALUES (DEFAULT, $1  ,  $2, $3,  $4 , 'NOW()', 'NOW()') RETURNING * `
									, [req.body.user_id, result.rows[0].id, 'add order', 'orders'])
								res.json({
									message: "Order added Successfully!",
									status: true,
									result: result.rows,
								});
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
			message: "Entered merchandise ID is not present",
			status: false,
		});

	}
}

Orders.GetAll = (req, res) => {
	sql.query(`SELECT "orders".id, "orders".ordered_at, "orders".status, "orders".createdat,
	 "orders".updatedat, "user".username, "user".email, "user".phone,"user".country_code,
	 "merchandise".name AS Merchandise_Name , "merchandise".price,
	  "merchandise".description AS Merchandise_description
	 FROM "orders" JOIN "user" ON "orders".user_id = "user".id
	  JOIN "merchandise"   ON  "orders".merchandise_id = "merchandise".id ORDER BY "createdat" DESC `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All orders",
				status: true,
				result: result.rows,
			});
		}
	});

}

Orders.GetByUserID = async (req, res) => {
	const Count = await sql.query(`SELECT Count(*)  AS count FROM "orders"
	WHERE user_id = $1 `
	   , [req.body.user_id]);
	sql.query(`SELECT  "orders".id, "orders".ordered_at, "orders".status, "orders".createdat,
	"orders".updatedat, "user".username, "user".email, "user".phone,"user".country_code,
	"merchandise".name AS Merchandise_Name , "merchandise".price,
	 "merchandise".description AS Merchandise_description,
	 "merchandise".images AS merchant_images
	FROM "orders" JOIN "user" ON "orders".user_id = "user".id
	 JOIN "merchandise"   ON  "orders".merchandise_id = "merchandise".id WHERE "orders".user_id = $1 ORDER BY "createdat" DESC `
		, [req.body.user_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "User's All orders",
					status: true,
					count: Count.rows[0].count,
					result: result.rows,
				});
			}
		});

}

Orders.GetByMarchandiseID = (req, res) => {
	sql.query(`SELECT "orders".id, "orders".ordered_at, "orders".status, "orders".createdat,
	"orders".updatedat, "user".username, "user".email, "user".phone,"user".country_code,
	"merchandise".name AS Merchandise_Name , "merchandise".price,
	 "merchandise".description AS Merchandise_description
	FROM "orders" JOIN "user" ON "orders".user_id = "user".id
	 JOIN "merchandise"   ON  "orders".merchandise_id = "merchandise".id WHERE "orders".merchandise_id = $1 ORDER BY "createdat" DESC `
		, [req.body.merchandise_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "specific merchandise orders",
					status: true,
					result: result.rows,
				});
			}
		});

}

Orders.GetByStatus = (req, res) => {
	sql.query(` SELECT "orders".id, "orders".ordered_at, "orders".status, "orders".createdat,
	"orders".updatedat, "user".username, "user".email, "user".phone,"user".country_code,
	"merchandise".name AS Merchandise_Name , "merchandise".price,
	 "merchandise".description AS Merchandise_description
	FROM "orders" JOIN "user" ON "orders".user_id = "user".id
	 JOIN "merchandise"   ON  "orders".merchandise_id = "merchandise".id WHERE "orders".status = $1 ORDER BY "createdat" DESC `
		, [req.body.status], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "specific merchandise orders",
					status: true,
					result: result.rows,
				});
			}
		});

}

Orders.GetUserOrders_ByStatus = (req, res) => {
	sql.query(`SELECT "orders".id, "orders".ordered_at, "orders".status, "orders".createdat,
	"orders".updatedat, "user".username, "user".email, "user".phone,"user".country_code,
	"merchandise".name AS Merchandise_Name , "merchandise".price,
	 "merchandise".description AS Merchandise_description
	FROM "orders" JOIN "user" ON "orders".user_id = "user".id
	 JOIN "merchandise"   ON  "orders".merchandise_id = "merchandise".id WHERE "orders".user_id = $1 AND "orders".status = $2  ORDER BY "createdat" DESC `
		, [req.body.user_id, req.body.status], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "specific merchandise orders",
					status: true,
					result: result.rows,
				});
			}
		});

}

Orders.changeOrderStatus = async (req, res) => {
	if (req.body.Order_ID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else if (req.body.status === '') {
		res.json({
			message: "status is required",
			status: false,
		});

	} else {
		const userData = await sql.query(`select * from "orders" where id = $1 
		`, [req.body.Order_ID]);

		if (userData.rowCount > 0) {

			const oldStatus = userData.rows[0].status;
			console.log(req.body);
			let { Order_ID, status } = req.body;
			if (status === undefined || status === '') {
				status = oldStatus;
			}
			sql.query(`UPDATE "orders" SET status = $1 WHERE id = $2;`,
				[status, Order_ID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount > 0) {
							const data = await sql.query(`select * from "orders" where id = $1`, [req.body.Order_ID]);
							res.json({
								message: "Status Updated Successfully!",
								status: true,
								result: data.rows,
							});
						} else if (result.rowCount === 0) {
							res.json({
								message: "Not Found",
								status: false,
							});
						}
					}
				});
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}


// Orders.Delete = async (req, res) => {
// 	const data = await sql.query(`select * from orders WHERE id = $1 AND user_id = $2`
// 		, [req.body.Order_ID, req.body.user_id])
// 	if (data.rows.length === 1) {
// 		sql.query(`DELETE FROM orders WHERE id = ${req.body.Order_ID};`, (err, result) => {
// 			if (err) {
// 				res.json({
// 					message: "Try Again",
// 					status: false,
// 					err
// 				});
// 			} else {
// 				res.json({
// 					message: "Social Media Links Deleted Successfully!",
// 					status: true,
// 					result: data.rows,

// 				});
// 			}
// 		});
// 	} else {
// 		res.json({
// 			message: "Not Found",
// 			status: false,
// 		});
// 	}
// }


module.exports = Orders;