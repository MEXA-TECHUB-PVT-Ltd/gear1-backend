const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = function (User) {
	this.username = User.username;
	this.email = User.email;
	this.phone = User.phone;
	this.country_code = User.country_code;
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
				const check = (`SELECT * FROM "user" WHERE phone = $1 AND country_code = $2`);
				const checkResult = await sql.query(check, [req.body.phone, req.body.country_code]);
				if (checkResult.rows.length > 0) {
					res.json({
						message: "User Already Exists",
						status: false,
					});
				} else if (checkResult.rows.length === 0) {
					const { phone, country_code, deviceToken } = req.body;
					const query = `INSERT INTO "user" (id, phone, country_code, deviceToken  ,createdat ,updatedat )
                            VALUES (DEFAULT, $1, $2,$3, 'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[phone, country_code, deviceToken]);
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
			// let image = userData.rows[0].image;
			// let cover_image = userData.rows[0].cover_image;

			let { id, username, email, phone, country_code } = req.body;
			// if (req.file) {
			// 	const { path } = req.file;
			// 	photo = path;
			// }
			if (username === undefined || username === '') {
				username = oldName;
			}
			if (email === undefined || email === '') {
				email = oldEmail;
			}
			if (phone === undefined || phone === '') {
				phone = oldPhone;
			}

			if (country_code === undefined || country_code === '') {
				country_code = oldCountry_code;
			}
			sql.query(`UPDATE "user" SET username = $1, email = $2, 
		phone = $3, country_code = $4 WHERE id = $5;`,
				[username, email, phone, country_code, id], async (err, result) => {
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
	 `, [req.params.id]);
	 const ratings = await sql.query(`SELECT COUNT(*) AS totalRatings FROM "rateusers"
	 where user_id = $1 
	  `, [req.params.id]);
	  const avgRatings = await sql.query(`SELECT rating FROM "rateusers"
	  where user_id = $1 
	   `, [req.params.id]);
	   console.log(avgRatings.rowCount);
	   let num = 0;
	   for(let i = 0; i < avgRatings.rowCount; i++){
		console.log(avgRatings.rows[i].rating);
			num += parseInt(avgRatings.rows[i].rating);
	   }
	   console.log(num);
	   let avg = (num/avgRatings.rowCount)
	   let finalAvg = avg.toFixed(2);
	   console.log("avg : "+finalAvg);
	  const followers = await sql.query(`SELECT COUNT(*) AS followers FROM "followusers"
	 where user_id = $1 
	  `, [req.params.id]);
	sql.query(`SELECT *  FROM "user" WHERE  id = $1`, [req.params.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
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
	const userData = await sql.query(`select COUNT(*) as count from "user"`);
	sql.query(`SELECT *  FROM "user"`, (err, result) => {
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
				count:userData.rows[0].count,
				result: result.rows
			});
		}
	});
}

module.exports = User;