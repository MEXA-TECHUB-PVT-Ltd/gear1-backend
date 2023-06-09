const { sql } = require("../config/db.config");
const fs = require('fs').promises;

const Merchandise = function (Merchandise) {
	this.adminID = Merchandise.adminID
	this.images = Merchandise.images;
	this.name = Merchandise.name;
	this.price = Merchandise.price;
	this.category_id = Merchandise.category_id;
	this.description = Merchandise.description;
	this.location = Merchandise.location;
	// this.shares = Merchandise.shares;
};

Merchandise.Add = async (req, res) => {
	const user = await sql.query(`select * from "admin" WHERE id = $1`
		, [req.body.adminID])
	const merchandise = await sql.query(`select * from categories WHERE id = $1`
		, [req.body.category_id])
	// const location = await sql.query(`select * from locations WHERE id = $1`
	// 	, [req.body.location])

	if (!req.body.adminID || req.body.adminID === '') {
		res.json({
			message: "Please Enter user-ID",
			status: false,
		});
	} else if (merchandise.rowCount > 0) {
		if (user.rowCount > 0) {
			// if (location.rowCount > 0) {
			// location INTEGER,
			// shares INTEGER,	
			sql.query(`CREATE TABLE IF NOT EXISTS public.merchandise (
        id SERIAL NOT NULL,
        adminID SERIAL NOT NULL,
        images TEXT[],
        name text,
		price text,
        category_id text,
        description text,
		location text,
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
					sql.query(`INSERT INTO merchandise (id, adminID ,images, name,price,category_id,description,location , createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3, $4, $5 ,$6, $7 , 'NOW()', 'NOW()') RETURNING * `
						, [req.body.adminID, [], req.body.name, req.body.price,
						req.body.category_id, req.body.description, req.body.location], (err, result) => {
							if (err) {
								console.log(err);
								res.json({
									message: "Try Again",
									status: false,
									err
								});
							}
							else {
								res.json({
									message: "Merchandise added Successfully!",
									status: true,
									result: result.rows,
								});
							}

						})

				};
			});
			// } else {
			// 	res.json({
			// 		message: "Entered location ID is not present",
			// 		status: false,
			// 	});
			// }

		} else {
			res.json({
				message: "Entered Admin ID is not present",
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


Merchandise.EditImages = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "merchandise" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let location = req.body.location;
			let photo = userData.rows[0].images;
			console.log(req.files);
			if (location > 0 || location < 4) {
				if (req.files.length < 6) {
					console.log("length : " + photo.length + " req  : " + req.files.length)
					if (req.files.length === 1) {
						let { id } = req.body;
						if (req.files) {
							for (let i = 0; i < req.files.length; i++) {
								if (userData.rows[0].images[location]) {
									fs.unlink(userData.rows[0].images[location], (err) => {
										if (err) {
											throw err;
										}
										console.log("Delete Image successfully.");
									});
								}
							}
							req.files.forEach(function (file) {
								photo[location] = (file.path)
							})
						}
						sql.query(`UPDATE "merchandise" SET images = $1 WHERE id = $2;`,
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
										const data = await sql.query(`select * from "merchandise" where id = $1`, [req.body.id]);
										res.json({
											message: "merchandise Images Updated Successfully!",
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
							message: "only 1 image can be update at a time",
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
					message: "Wrong Location for image",
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
}



Merchandise.addImages = async (req, res) => {
	console.log(req.body.id);
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "merchandise" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {
			console.log(req.files)
			let photo = userData.rows[0].images;
			console.log(photo.length);
			if (photo.length < 5) {
				if (req.files.length < 6) {
					console.log("length" + photo.length + req.files.length)
					if (photo.length + req.files.length <= 5) {
						let { id } = req.body;
						if (req.files) {
							req.files.forEach(function (file) {
								photo.push(file.path)
							})
						}

						// let photo = userData.rows[0].images;
						// console.log(photo.length);
						// if (photo.length < 5) {
						// 	if (req.files.length < 6) {
						// 		if (photo.length + 1 + req.files.length <= 5) {
						// 			let { id } = req.body;
						// 			if (req.files) {
						// 				req.files.forEach(function (file) {
						// 					photo.push(file.path)
						// 				})
						// 			}
						sql.query(`UPDATE "merchandise" SET images = $1 WHERE id = $2;`,
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
										const data = await sql.query(`select * from "merchandise" where id = $1`, [req.body.id]);
										res.json({
											message: "Merchandise Images added Successfully!",
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
}


Merchandise.GetMerchandise = (req, res) => {
	sql.query(`SELECT "merchandise".* , "categories".name AS Catagory_name
	 FROM "merchandise" JOIN "categories" 
	ON  CAST( "merchandise".category_id AS INT) = "categories".id 
	 WHERE "merchandise".id = $1 `
		, [req.body.Merchandise_ID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "merchandise data",
					status: true,
					result: result.rows,
				});
			}
		});

}


Merchandise.GetAllMerchandise = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "merchandise"`);
	sql.query(`SELECT "merchandise".* , "categories".name AS Catagory_name
	FROM "merchandise" JOIN "categories" 
   ON  CAST( "merchandise".category_id AS INT) = "categories".id  ORDER BY "createdat" DESC`
		, (err, result) => {
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
					message: "All Merchandise list",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});

}

// Merchandise.GetMerchandiseByCategory = (req, res) => {
// 	sql.query(`SELECT * FROM "merchandise" WHERE category_id = $1 `
// 		, [req.body.category_ID], (err, result) => {
// 			if (err) {
// 				console.log(err);
// 				res.json({
// 					message: "Try Again",
// 					status: false,
// 					err
// 				});
// 			} else {
// 				res.json({
// 					message: "Category's merchandise data",
// 					status: true,
// 					result: result.rows,
// 				});
// 			}
// 		});

// }


// Merchandise.search = (req, res) => {
// 	sql.query(`SELECT * FROM "merchandise" WHERE name = $1 `
// 		, [req.body.name], (err, result) => {
// 			if (err) {
// 				console.log(err);
// 				res.json({
// 					message: "Try Again",
// 					status: false,
// 					err
// 				});
// 			} else {
// 				res.json({
// 					message: "Search's merchandise data",
// 					status: true,
// 					result: result.rows,
// 				});
// 			}
// 		});

// }


Merchandise.Update = async (req, res) => {
	if (req.body.Merchandise_ID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "merchandise" where id = $1 
		`, [req.body.Merchandise_ID]);

		if (userData.rowCount === 1) {

			const oldName = userData.rows[0].name;
			const oldCategory_id = userData.rows[0].category_id;
			const oldPrice = userData.rows[0].price;
			const oldDescription = userData.rows[0].description;
			const oldlocation = userData.rows[0].location;

			let { Merchandise_ID, name, category_id, location, price, description } = req.body;
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
				location = oldlocation;
			}

			sql.query(`UPDATE "merchandise" SET name = $1, category_id = $2, 
		price = $3, description = $4 , location = $5 WHERE id = $6;`,
				[name, category_id, price, description, location, Merchandise_ID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "merchandise" where id = $1`, [req.body.Merchandise_ID]);
							res.json({
								message: "Merchandise Updated Successfully!",
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


Merchandise.Delete = async (req, res) => {
	const data = await sql.query(`select * from merchandise WHERE id = $1 `
		, [req.body.Merchandise_ID])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM merchandise WHERE id = ${req.body.Merchandise_ID};`, (err, result) => {
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


module.exports = Merchandise;