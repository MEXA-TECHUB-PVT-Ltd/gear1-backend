const { sql } = require("../config/db.config");
const schedule = require('node-schedule');

const Items = function (Items) {
	this.userID = Items.userID
	this.images = Items.images;
	this.name = Items.name;
	this.price = Items.price;
	this.category_id = Items.category_id;
	this.description = Items.description;
	this.likes = Items.likes;
	this.shares = Items.shares;
};

Items.Add = async (req, res) => {
	const user = await sql.query(`select * from "user" WHERE id = $1`
		, [req.body.user_ID])
	const merchandise = await sql.query(`select * from categories WHERE id = $1`
		, [req.body.category_id])

	if (!req.body.user_ID || req.body.user_ID === '') {
		res.json({
			message: "Please Enter user-ID",
			status: false,
		});
	} else if (merchandise.rowCount > 0) {
		if (user.rowCount > 0) {
			sql.query(`CREATE TABLE IF NOT EXISTS public.items (
        id SERIAL NOT NULL,
		userid SERIAL NOT NULL,
        images TEXT[],
        name text,
		price text,
        category_id text,
        description text,
		location text,
		promoted text,
		start_date timestamp,
		end_date timestamp,
		added_by text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));` , (err, result) => {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					const end_date = new Date(req.body.end_date);
					const start_date = new Date(req.body.start_date);
					sql.query(`INSERT INTO items (id,userid ,images, name,price,category_id,description , location,
					 promoted, start_date , end_date , added_by ,  createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3, $4, $5 ,$6,$7,$8,$9,$10,$11,  'NOW()', 'NOW()') RETURNING * `
						, [req.body.user_ID, [], req.body.name, req.body.price,
						req.body.category_id, req.body.description, req.body.location, 'false'
							, start_date,end_date, req.body.added_by], (err, result) => {
								if (err) {
									console.log(err);
									res.json({
										message: "Try Again",
										status: false,
										err
									});
								}
								else {
									if (req.body.promoted === true) {
										// 86400000 ===== 24 hours
										const startTime = new Date(req.body.start_date);
										console.log(startTime);
										const endTime = new Date(startTime.getTime() + 1000);
										let job1 = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function () {
											const userData = await sql.query(`UPDATE "items" SET promoted = $1
									 WHERE id = $2;`, ['true', result.rows[0].id]);
											console.log('status Change!');

										});

										const startTimeFalse = new Date(req.body.end_date);
										console.log(startTimeFalse);
										const endTimeFalse = new Date(startTimeFalse.getTime() + 1000);
										let job = schedule.scheduleJob({ start: startTimeFalse, end: endTimeFalse, rule: '*/1 * * * * *' }, async function () {
											const userData = await sql.query(`UPDATE "items" SET promoted = $1
									 WHERE id = $2;`, ['false', result.rows[0].id]);
											console.log('status Changes After!');
										});
									}
									res.json({
										message: "product added Successfully!",
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
			message: "Entered Catagory ID is not present",
			status: false,
		});
	}
}


Items.addImages = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "items" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].images;
			console.log(req.files);
			if (photo.length < 5) {
				if (req.files.length < 6) {
					console.log("length : " + photo.length + " req  : "+ req.files.length)
					if (photo.length + req.files.length <= 5) {
						let { id } = req.body;
						if (req.files) {
							req.files.forEach(function (file) {
								photo.push(file.path)
							})
						}
						sql.query(`UPDATE "items" SET images = $1 WHERE id = $2;`,
							[photo, req.body.id], async (err, result) => {
								if (err) {
									console.log(err);
									res.json({
										message: "Try Again",
										status: false,
										err
									});
								} else {
									if (result.rowCount === 1) {
										const data = await sql.query(`select * from "items" where id = $1`, [req.body.id]);
										res.json({
											message: "items Images added Successfully!",
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
							message: "Max 5 images allowed (Selected images will exceed this limit)",
							status: false,
						});
					}
				}
				else {
					res.json({
						message: "Max 5 images allowed",
						status: false,
					});
				}
			} else {
				res.json({
					message: "No More images allowed",
					status: false,
				});
			}
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}


	// } else {
	// 	const userData = await sql.query(`select * from "items" where id = $1`, [req.body.id]);
	// 	if (userData.rowCount === 1) {

	// 		let photo = userData.rows[0].images;
	// 		console.log(photo);
	// 		let myArray = [];
	// 		if (photo === null || photo === '') {
	// 			myArray = [];
	// 		} else {
	// 			myArray = photo.split(",");
	// 			console.log("myArray");
	// 			console.log(myArray.length);
	// 			console.log(myArray);
	// 		}
	// 		console.log(myArray.length);
	// 		if (myArray.length < 5) {
	// 			let { id } = req.body;
	// 			if (req.files) {
	// 				for (let i = 0; i < req.files.length; i++) {
	// 					const { path } = req.files[i];
	// 					photo = `${photo}, ${path} `;

	// 				}
	// 			}
	// 			sql.query(`UPDATE "items" SET images = $1 WHERE id = $2;`,
	// 				[photo, req.body.id], async (err, result) => {
	// 					if (err) {
	// 						console.log(err);
	// 						res.json({
	// 							message: "Try Again",
	// 							status: false,
	// 							err
	// 						});
	// 					} else {
	// 						if (result.rowCount === 1) {
	// 							const data = await sql.query(`select * from "items" where id = $1`, [req.body.id]);
	// 							res.json({
	// 								message: "Item Images added Successfully!",
	// 								status: true,
	// 								result: data.rows,
	// 							});
	// 						} else if (result.rowCount === 0) {
	// 							res.json({
	// 								message: "Not Found",
	// 								status: false,
	// 							});
	// 						}
	// 					}
	// 				});
	// 		}
	// 		else {
	// 			res.json({
	// 				message: "Max 5 images allowed",
	// 				status: false,
	// 			});
	// 		}

	// 	} else {
	// 		res.json({
	// 			message: "Not Found",
	// 			status: false,
	// 		});
	// 	}
	// }
}


Items.GetItem = async (req, res) => {
	const liked = await sql.query(`SELECT user_id  AS likey_by FROM "likeitems"
	 WHERE item_id = $1  `
	, [req.body.Item_ID]);

	sql.query(`SELECT * FROM "items" WHERE id = $1  `
		, [req.body.Item_ID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "items data",
					status: true,
					liked_by: liked.rows,
					result: result.rows,
				});
			}
		});

}


Items.GetLocIDItems = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "items" WHERE location_id = $1`, [req.body.location_id]);
	sql.query(`SELECT * FROM "items" WHERE location_id = $1 ORDER BY "createdat" DESC `
		, [req.body.location_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "User's items data by location",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});

}


Items.GetUserItems = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "items" WHERE userid = $1`, [req.body.user_ID]);
	sql.query(`SELECT * FROM "items" WHERE userid = $1 ORDER BY "createdat" DESC`
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
					message: "User's items data",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});

}

Items.GetAllItems = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "items"`);

	sql.query(`SELECT * FROM "items" ORDER BY "createdat" DESC `
		, (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "User's items data",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});

}

Items.GetItemsByCategory = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "items" WHERE category_id = $1`, [req.body.category_ID]);
	sql.query(`SELECT * FROM "items" WHERE category_id = $1 ORDER BY "createdat" DESC `
		, [req.body.category_ID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Category's items data",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});

}


Items.search = async (req, res) => {
	const data = await sql.query(`SELECT * FROM "categories" WHERE name ILIKE  $1 ORDER BY "createdat" DESC `
	, [`${req.body.name}%`]);
	sql.query(`SELECT * FROM "items" WHERE name ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Search's items data",
					status: true,
					categories: data.rows,
					items: result.rows,
				});
			}
		});

}


Items.Update = async (req, res) => {
	if (req.body.Item_ID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "items" where id = $1 
		`, [req.body.Item_ID]);

		if (userData.rowCount === 1) {
			// promoted text,
			// start_date timestamp,
			// end_date timestamp,

			const oldName = userData.rows[0].name;
			const oldCategory_id = userData.rows[0].category_id;
			const oldPrice = userData.rows[0].price;
			const oldDescription = userData.rows[0].description;
			const oldLocation = userData.rows[0].location;
			const oldPromoted = userData.rows[0].promoted;
			const oldStart_date = userData.rows[0].start_date;
			const oldEnd_date = userData.rows[0].end_date;

			let { Item_ID, name, category_id, price, description, location,promoted, start_date, end_date } = req.body;
			if (name === undefined || name === '') {
				name = oldName;
			}
			if (category_id === undefined || category_id === '') {
				category_id = oldCategory_id;
			}
			if (price === undefined || price === '') {
				price = oldPrice;
			}

			if (description === undefined || description === '') {
				description = oldDescription;
			}
			if (location === undefined || location === '') {
				location = oldLocation;
			}

			if (promoted === undefined || promoted === '') {
				promoted = oldPromoted;
			}
			if (start_date === undefined || start_date === '') {
				start_date = oldStart_date;
			}
			if (end_date === undefined || end_date === '') {
				end_date = oldEnd_date;
			}

			sql.query(`UPDATE "items" SET name = $1, category_id = $2, 
		price = $3, description = $4,location = $5, promoted = $5 , start_date = $6, end_date = $7 WHERE id = $8;`,
				[name, category_id, price, description, location,promoted, start_date, end_date, Item_ID], async (err, result) => {
					if (err) {
						end_date
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "items" where id = $1`, [req.body.Item_ID]);
							if (req.body.promoted === 'true') {
								// 86400000 ===== 24 hours
								const startTime = new Date(start_date);
								console.log(startTime);
								const endTime = new Date(startTime.getTime() + 1000);
								let job1 = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function () {
									const userData = await sql.query(`UPDATE "items" SET promoted = $1
									 WHERE id = $2;`, ['true', Item_ID]);
									console.log('status Change!');

								});
								const startTimeFalse = new Date(end_date);
								console.log(startTimeFalse);
								const endTimeFalse = new Date(startTimeFalse.getTime() + 1000);
								let job = schedule.scheduleJob({ start: startTimeFalse, end: endTimeFalse, rule: '*/1 * * * * *' }, async function () {
									const userData = await sql.query(`UPDATE "items" SET promoted = $1
									 WHERE id = $2;`, ['false', Item_ID]);
									console.log('status Change!');
								});
							}
							res.json({
								message: "Item Updated Successfully!",
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


Items.Delete = async (req, res) => {
	const data = await sql.query(`select * from items WHERE id = $1 `
		, [req.body.Item_ID])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM items WHERE id = ${req.body.Item_ID};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Item Deleted Successfully!",
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


module.exports = Items;