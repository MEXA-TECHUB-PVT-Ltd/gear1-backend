const { sql } = require("../config/db.config");

const image_cache = function (image_cache) {
	this.file_id = image_cache.file_id;
	this.image = image_cache.image;

};

image_cache.addImage = async (req, res) => {
	if (!req.body.file_id || req.body.file_id === '') {
		res.json({
			message: "Please Enter Category file_id",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.image_cache (
        id SERIAL,
        file_id text,
		image text,
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
				let photo = '';
				console.log(req.file)
				if (req.file) {
					const { path } = req.file;
					photo = path;
				}	
				sql.query(`INSERT INTO "image_cache" (id, file_id ,image, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1 ,$2, 'NOW()', 'NOW()') 
							RETURNING * `, [req.body.file_id, photo], (err, result) => {
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
							message: "Image Added Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}



image_cache.GetOne = (req, res) => {
	sql.query(`SELECT * FROM "image_cache" WHERE id = ${req.body.id};`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Specific image",
				status: true,
				result: result.rows
			});
		}
	});
}

image_cache.GetAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "image_cache"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "image_cache" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "image_cache" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "image Details",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}



image_cache.Update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "image_cache" where id = $1 
		`, [req.body.id]);

		if (userData.rowCount > 0) {

			let photo = userData.rows[0].image;
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}	

			let { id,  } = req.body;
			sql.query(`UPDATE "image_cache" SET image = $1 WHERE id = $2;`,
				[photo , id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "image_cache" where id = $1`, [req.body.id]);
							res.json({
								message: "Image Updated Successfully!",
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


image_cache.Delete = async (req, res) => {
	const data = await sql.query(`select * from "image_cache" where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM image_cache WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "image Deleted Successfully!",
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
module.exports = image_cache;
