const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = function (User) {
	this.username = User.username;
	this.email = User.email;
	this.phone = User.phone;
	this.country_code = User.country_code;
	this.address = User.address;
	this.image = User.image;
	this.cover_image = User.cover_image;
	this.status = User.status;
	this.type = User.type;
	this.deviceToken = User.deviceToken;

};
User.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.User (
		id SERIAL NOT NULL,
        username text,
        email   text,
        phone text NOT NULL,
        country_code text ,
		address text,
        image   text ,
        cover_image text ,
		deviceToken text,
        status text,
        type text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)); ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.phone || req.body.phone === '') {
				res.json({
					message: "Please Enter Phone",
					status: false,
				});
			} else if (!req.body.country_code || req.body.country_code === '') {
				res.json({
					message: "Please Enter Country Code",
					status: false,
				});
			} else {
				console.log(req.body);
				const check = (`SELECT * FROM "user" WHERE phone = $1 AND country_code = $2`);
				const checkResult = await sql.query(check, [req.body.phone, req.body.country_code]);
				if (checkResult.rows.length > 0) {
					res.json({
						message: "User Already Exists",
						status: false,
					});
				} else if (checkResult.rows.length === 0) {
					const { phone, country_code, deviceToken, type, address } = req.body;
					const query = `INSERT INTO "user" (id, phone, country_code, address, deviceToken,status ,type ,createdat ,updatedat )
                            VALUES (DEFAULT, $1, $2,$3,$4,$5,$6, 'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[phone, country_code, address, deviceToken, 'unblock', type]);
					if (foundResult.rows.length > 0) {
						if (err) {
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							const token = jwt.sign({ id: foundResult.rows[0].id }, 'IhTRsIsUwMyHAmKsA', {
								expiresIn: "7d",
							});
							res.json({
								message: "User Added Successfully!",
								status: true,
								result: foundResult.rows,
								token: token
							});
						}
					} else {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}

				};
			}
		}
	});

}

User.login = async function (req, res) {

	sql.query(`SELECT * FROM "user"  WHERE phone = $1 AND country_code = $2`, [req.body.phone, req.body.country_code], async (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		}
		else {
			if (result.rows.length === 0) {
				res.json({
					message: "User Not Found",
					status: false,
				});
			} else {
				const userData = await sql.query(`UPDATE "user" SET deviceToken = $1
				WHERE id = $2;`,
					[req.body.deviceToken, result.rows[0].id]);
				const loginData = await sql.query(`SELECT * FROM "user"  WHERE phone = $1 
						AND country_code = $2`, [req.body.phone, req.body.country_code]);

				// if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
				const token = jwt.sign({ id: result.rows[0].id }, 'IhTRsIsUwMyHAmKsA', {
					expiresIn: "7d",
				});
				res.json({
					message: "Login Successful",
					status: true,
					result: loginData.rows,
					token
				});
				// } else {
				// 	res.json({
				// 		message: "Invalid Password",
				// 		status: false,
				// 	});
				// }
			}
		}
	});
}

User.addImage = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].image;
			// let image = userData.rows[0].image;
			// let cover_image = userData.rows[0].cover_image;

			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "user" SET image = $1 WHERE id = $2;`,
				[photo, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Image added Successfully!",
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


User.addCoverImage = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].cover_image;

			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "user" SET cover_image = $1 WHERE id = $2;`,
				[photo, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User cover Image added Successfully!",
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


User.updateProfile = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			const oldName = userData.rows[0].username;
			const oldEmail = userData.rows[0].email;
			const oldPhone = userData.rows[0].phone;
			const oldCountry_code = userData.rows[0].country_code;
			const oldAddress = userData.rows[0].address;

			let { id, username, email, phone, country_code, address } = req.body;

			if (username === undefined || username === '') {
				username = oldName;
			}
			if (email === undefined || email === '') {
				email = oldEmail;
			}
			if (phone === undefined || phone === '') {
				phone = oldPhone;
			}
			if (address === undefined || address === '') {
				address = oldAddress;
			}

			if (country_code === undefined || country_code === '') {
				country_code = oldCountry_code;
			}
			sql.query(`UPDATE "user" SET username = $1, email = $2, 
		phone = $3, country_code = $4, address = $5 WHERE id = $6;`,
				[username, email, phone, country_code, address, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Updated Successfully!",
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

User.ChangeNumber = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			const oldPhone = userData.rows[0].phone;
			const oldCountry_code = userData.rows[0].country_code;

			let { id, phone, country_code } = req.body;
			if (phone === undefined || phone === '') {
				phone = oldPhone;
			}
			if (country_code === undefined || country_code === '') {
				country_code = oldCountry_code;
			}
			sql.query(`UPDATE "user" SET phone = $1, country_code = $2 WHERE id = $3;`,
				[phone, country_code, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Phone Number Change Successfully!",
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

User.SpecificUser = async (req, res) => {
	const followings = await sql.query(`SELECT COUNT(*) AS followings FROM "followusers"
	where follow_by_user_id = $1 
	 `, [req.body.Viewing_user]);
	const items = await sql.query(`SELECT COUNT(*) AS items FROM "items"
	 where userid = $1 
	  `, [req.body.Viewing_user]);
	const likedItems = await sql.query(`SELECT COUNT(*) AS liked_items FROM "likeitems"
	 where user_id = $1 
	  `, [req.body.Viewing_user]);
	const social_media = await sql.query(`SELECT *  FROM "socialmedia" 
	 where userid = $1 
	  `, [req.body.Viewing_user]);



	const reported_items = await sql.query(`SELECT COUNT(*) AS reported_items  FROM "report_items" 
	 where report_by = $1 
	  `, [req.body.Viewing_user]);
	const saved_items = await sql.query(`SELECT COUNT(*) AS saved_items  FROM "saveitems" 
	 where user_id = $1 
	  `, [req.body.Viewing_user]);
	const shared_items = await sql.query(`SELECT COUNT(*) AS shared_items  FROM "shareitems" 
	 where user_id = $1 
	  `, [req.body.Viewing_user]);
	const report_ads = await sql.query(`SELECT COUNT(*) AS report_ads  FROM "report_ads" 
	 where report_by = $1 
	  `, [req.body.Viewing_user]);

	const ratings = await sql.query(`SELECT COUNT(*) AS totalRatings FROM "rateusers"
	 where user_id = $1 
	  `, [req.body.Viewing_user]);
	const avgRatings = await sql.query(`SELECT rating FROM "rateusers"
	  where user_id = $1 
	   `, [req.body.Viewing_user]);
	console.log(avgRatings.rowCount);
	let num = 0;
	for (let i = 0; i < avgRatings.rowCount; i++) {
		console.log(avgRatings.rows[i].rating);
		num += parseInt(avgRatings.rows[i].rating);
	}
	console.log(num);
	let avg = (num / avgRatings.rowCount)
	let finalAvg = avg.toFixed(2);
	console.log("avg : " + finalAvg);
	const followers = await sql.query(`SELECT COUNT(*) AS followers FROM "followusers"
	 where user_id = $1 
	  `, [req.body.Viewing_user]);
	sql.query(`SELECT *  FROM "user" WHERE  id = $1`, [req.body.Viewing_user], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const History = sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, action_table ,createdAt ,updatedAt )
				VALUES (DEFAULT, $1  ,  $2, $3,  $4 , 'NOW()', 'NOW()') RETURNING * `
				, [req.body.Viewing_user, req.body.logged_in_user, 'view profile', 'user'])
			res.json({
				message: "User Details",
				status: true,
				items: items.rows[0].items,
				likedItems: likedItems.rows[0].liked_items,
				social_media: social_media.rows[0],

				reported_items: reported_items.rows[0].reported_items,
				saved_items: saved_items.rows[0].saved_items,
				shared_items: shared_items.rows[0].shared_items,
				report_ads: report_ads.rows[0].report_ads,

				followers: followers.rows[0].followers,
				followings: followings.rows[0].followings,
				Total_Ratings: ratings.rows[0].totalratings,
				avgRatings: finalAvg,
				result: result.rows
			});
		}
	});
}


User.AllUsers = async (req, res) => {
	const userData = await sql.query(`select COUNT(*) as count from "user"  `);
	sql.query(`SELECT *  FROM "user" ORDER BY "createdat" DESC ;`, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All User Details",
				status: true,
				count: userData.rows[0].count,
				result: result.rows
			});
		}
	});
}

User.getHistory = async (req, res) => {
	const userData = await sql.query(`SELECT
	createdat::date AS history_date,
	action_type AS title,
	action_id AS action_id,
	action_table AS table
			FROM
    			history
			WHERE
   				user_id = $1
			ORDER BY
 				   createdat::date DESC,
 				   createdat DESC;
`, [req.body.user_id]);

	if (userData.rowCount > 0) {
		const groupedData = {};

		for (const row of userData.rows) {
			const Data = await sql.query(`SELECT *
            FROM
                "${row.table}"
            WHERE id::text = '${row.action_id}'`);
			row.data = Data.rows;

			const historyDate = row.history_date.toString();
			if (!groupedData[historyDate]) {
				groupedData[historyDate] = [];
			}
			groupedData[historyDate].push(row);
		}

		const result = Object.keys(groupedData).map(historyDate => {
			return {
				history_date: historyDate,
				data: groupedData[historyDate]
			};
		});

		res.json({
			message: "User History",
			status: true,
			results: result,
		});

	} else {
		res.json({
			message: "No History Found",
			status: false,
		});
	}
}





User.getYears = (req, res) => {
	sql.query(`SELECT EXTRACT(year FROM  createdat) AS year
	FROM "user" 
	GROUP BY EXTRACT(year FROM createdat )
	ORDER BY year `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "user table's years",
				status: true,
				result: result.rows,
			});
		}
	});

}
User.getAllUsers_MonthWise_count = (req, res) => {
	sql.query(`
	


	SELECT months.month, COUNT(u.createdat) AS count
FROM (
    SELECT generate_series(1, 12) AS month
) AS months
LEFT JOIN "user" AS u ON EXTRACT(month FROM u.createdat) = months.month
                      AND EXTRACT(year FROM u.createdat) = $1
GROUP BY months.month
ORDER BY months.month;
	
	`, [req.body.year], (err, result) => {
		// for (let i = 0; i < 12; i++) {
		// 	if (result.rows[i]) {
		// 		console.log(result.rows[i]);
		// 		if (result.rows[i].month !== [i]) {
		// 			result.rows[i] = {
		// 				month: i,
		// 				count: "0"
		// 			}
		// 		}
		// 	}
		// }

		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			console.log(result.rows);
			res.json({
				message: "Monthly added Users",
				status: true,
				result: result.rows,
			});
		}
	});

}


User.Delete = async (req, res) => {
	try {
		const user_id = req.body.user_id;
		if (!user_id) {
			return (
				res.json({
					message: "Please Provide user_id",
					status: false
				})
			)
		}
		const query0 = 'DELETE FROM "user" where id = $1 ';
		const result0 = await sql.query(query0, [user_id]);

		const query = 'DELETE FROM items WHERE userid = $1 RETURNING id';
		const result = await sql.query(query, [user_id]);
		for (let i = 0; i < result.rows.length; i++) {

			const query1 = 'DELETE FROM likeitems WHERE item_id = $1 RETURNING *';
			const result1 = await sql.query(query1, [result.rows[i].id]);
			const query2 = 'DELETE FROM saveitems WHERE item_id = $1 RETURNING *';
			const result2 = await sql.query(query2, [result.rows[i].id]);

			const query3 = 'DELETE FROM shareitems WHERE item_id = $1 RETURNING *';
			const result3 = await sql.query(query3, [result.rows[i].id]);

			const query4 = 'DELETE FROM report_items WHERE report_id = $1 RETURNING *';
			const result4 = await sql.query(query4, [result.rows[i].id]);
		}
		const query1 = 'DELETE FROM likeitems WHERE user_id = $1 RETURNING *';
		const result1 = await sql.query(query1, [user_id]);
		const query2 = 'DELETE FROM saveitems WHERE user_id = $1 RETURNING *';
		const result2 = await sql.query(query2, [user_id]);

		const query3 = 'DELETE FROM shareitems WHERE user_id = $1 RETURNING *';
		const result3 = await sql.query(query3, [user_id]);


		const query5 = 'DELETE FROM orders  where user_id = $1';
		const result5 = await sql.query(query5, [user_id]);

		const query6 = 'DELETE FROM report_ads  where report_by = $1';
		const result6 = await sql.query(query6, [user_id]);

		const query7 = 'DELETE FROM socialmedia where userid = $1';
		const result7 = await sql.query(query7, [user_id]);

		const query8 = 'DELETE FROM rateusers where rate_by_user_id = $1 OR user_id = $2';
		const result8 = await sql.query(query8, [user_id,user_id ]);

		const query9 = 'DELETE FROM history  where user_id = $1 OR action_id = $2';
		const result9 = await sql.query(query9, [user_id, user_id]);

		const query10 = 'DELETE FROM followusers where user_id = $1 OR  follow_by_user_id = $2';
		const result10 = await sql.query(query10, [user_id, user_id]);


		if (result0.rowCount > 0) {
			res.status(200).json({
				message: "Deletion successfull",
				status: true,
				// deletedRecord: deletedEntries
			})
		}
		else {
			res.status(404).json({
				message: "Could not delete . Record With this Id may not found or req.body may be empty",
				status: false,
			})
		}

	}
	catch (err) {
		res.json({
			message: "Error",
			status: false,
			error: err.message
		})
	}
}


User.DeleteAll = async (req, res) => {
	try {
		const query = 'DELETE FROM "user"  ';
		const result = await sql.query(query);

		const query0 = 'DELETE FROM items  ';
		const result0 = await sql.query(query0);


		const query1 = 'DELETE FROM likeitems  ';
		const result1 = await sql.query(query1);
		const query2 = 'DELETE FROM saveitems  ';
		const result2 = await sql.query(query2);

		const query3 = 'DELETE FROM shareitems ';
		const result3 = await sql.query(query3);

		const query4 = 'DELETE FROM report_items ';
		const result4 = await sql.query(query4);

		const query5 = 'DELETE FROM orders  ';
		const result5 = await sql.query(query5);

		const query6 = 'DELETE FROM report_ads  ';
		const result6 = await sql.query(query6);

		const query7 = 'DELETE FROM socialmedia ';
		const result7 = await sql.query(query7);

		const query8 = 'DELETE FROM rateusers ';
		const result8 = await sql.query(query8);

		const query9 = 'DELETE FROM history  ';
		const result9 = await sql.query(query9);

		const query10 = 'DELETE FROM followusers';
		const result10 = await sql.query(query10);



		if (result.rowCount > 0) {
			res.status(200).json({
				message: "Deletion successfull",
				status: true,
				// deletedRecord: deletedEntries
			})
		}
		else {
			res.status(404).json({
				message: "Could not delete . Record With this Id may not found or req.body may be empty",
				status: false,
			})
		}

	}
	catch (err) {
		res.json({
			message: "Error",
			status: false,
			error: err.message
		})
	}
}




module.exports = User;