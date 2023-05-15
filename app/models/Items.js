const { sql } = require("../config/db.config");

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
	if (!req.body.userID || req.body.userID === '') {
		res.json({
			message: "Please Enter user-ID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.items (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        images TEXT[],
        name text,
		price text,
        category_id text,
        description text,
		likes INTEGER,
		shares INTEGER,	
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
				sql.query(`INSERT INTO items (id, userid ,images, name,price,category_id,description , likes, shares, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3, $4, $5 ,$6,$7,$8,  'NOW()', 'NOW()') RETURNING * `
					, [req.body.userID, [],req.body.name, req.body.price,
					req.body.category_id, req.body.description, '0', '0'], (err, result) => {
						if (err) {

							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							res.json({
								message: "product added Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
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
			console.log(photo.length);
			if (photo.length < 5) {
				if (req.files.length < 6) {
					console.log("length"+photo.length + req.files.length)
					if(photo.length + req.files.length <= 5 ){
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
					}else{
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
			}else{
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


Items.GetItem = (req, res) => {
	sql.query(`SELECT * FROM "items" WHERE id = $1 `
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
					result: result.rows,
				});
			}
		});

}


Items.GetUserItems = (req, res) => {
	sql.query(`SELECT * FROM "items" WHERE userid = $1 `
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
					result: result.rows,
				});
			}
		});

}

Items.GetAllItems = (req, res) => {
	sql.query(`SELECT * FROM "items" `
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
					result: result.rows,
				});
			}
		});

}

Items.GetItemsByCategory = (req, res) => {
	sql.query(`SELECT * FROM "items" WHERE category_id = $1 `
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
					result: result.rows,
				});
			}
		});

}


Items.search = (req, res) => {
	sql.query(`SELECT * FROM "items" WHERE name = $1 `
		, [req.body.name], (err, result) => {
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
					result: result.rows,
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

			const oldName = userData.rows[0].name;
			const oldCategory_id = userData.rows[0].category_id;
			const oldPrice = userData.rows[0].price;
			const oldDescription = userData.rows[0].description;

			let { Item_ID, name, category_id, price, description } = req.body;
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
			sql.query(`UPDATE "items" SET name = $1, category_id = $2, 
		price = $3, description = $4 WHERE id = $5;`,
				[name, category_id, price, description, Item_ID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "items" where id = $1`, [req.body.Item_ID]);
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