const { sql } = require("../config/db.config");

const Logos = function (Logos) {
	this.image = Logos.image
	this.link = Logos.link;
	this.screen_id = Logos.screen_id;
	this.active_status = Logos.active_status;

};
Logos.Add = async (req, res) => {
	if (!req.body.screen_id || req.body.screen_id === '') {
		res.json({
			message: "Please Enter screen ID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.logos (
        id SERIAL NOT NULL,
        image text,
        link text,
		screen_id SERIAL NOT NULL,
        active_status text,
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
				sql.query(`INSERT INTO logos (id , link, screen_id, active_status, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3 ,  'NOW()', 'NOW()') RETURNING * `
					, [req.body.link, req.body.screen_id, 'active'], (err, result) => {
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
								message: "Logo added Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
		});
	}
}

Logos.addImage = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "logos" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].image;

			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "logos" SET image = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "logos" where id = $1`, [req.body.id]);
							res.json({
								message: "Logo Image added Successfully!",
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




Logos.Get = (req, res) => {
	sql.query(`SELECT "logos".*, "screens".name AS screen_name FROM "logos" JOIN "screens"
	ON "logos".screen_id = "screens".id WHERE "logos".id = $1 `
		, [req.body.logo_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Logo Data",
					status: true,
					result: result.rows,
				});
			}
		});

}

Logos.GetAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "logos"`)
	sql.query(`SELECT "logos".*, "screens".name AS screen_name FROM "logos" JOIN "screens"
	 ON "logos".screen_id = "screens".id ORDER BY "createdat" DESC `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			// result.rows.push({
			// 	allLogos:
			// 		data.rows[0].allLogos
			// });
			res.json({
				message: "Logo Data",
				status: true,
				count: data.rows.count,
				result: result.rows,
			});
		}
	});

}

Logos.GetByScreen = async (req, res) => {

	const data = await sql.query(`SELECT COUNT(*) AS AllLogos FROM "logos"`)
	sql.query(`SELECT "logos".*, "screens".name AS screen_name FROM "logos" JOIN "screens"
	ON "logos".screen_id = "screens".id WHERE "logos".screen_id = $1 `,
	[req.body.screen_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				// result.rows.push({
				// 	allLogos:
				// 		data.rows[0].allLogos
				// });	
				res.json({
					message: "Logo Data by Screen",
					status: true,
					count: data.rows[0].allLogos,
					result: result.rows,
				});
			}
		});

}


Logos.GetActiveByScreen = async (req, res) => {

	const data = await sql.query(`SELECT COUNT(*) AS AllAds FROM "logos"`)
	sql.query(`SELECT "logos".*, "screens".name AS screen_name FROM "logos" JOIN "screens"
	ON "logos".screen_id = "screens".id WHERE "logos".screen_id = $1 AND "logos".active_status = $2 ORDER BY "createdat" DESC `,
	[req.body.screen_id, 'active'], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				// result.rows.push({
				// 	allLogos:
				// 		data.rows[0].allLogos
				// });	
				res.json({
					message: "Active Logo's Data by Screen",
					status: true,
					count: data.rows[0].allLogos,
					result: result.rows,
				});
			}
		});

}



Logos.Update = async (req, res) => {
	if (req.body.logo_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "logos"
		 where id = $1 `, [req.body.logo_id]);

		if (userData.rowCount === 1) {

			const oldLink = userData.rows[0].link;
			const oldScreen = userData.rows[0].screen_id;
			const oldActive_status = userData.rows[0].active_status;

			let { logo_id, link, screen_id, active_status } = req.body;
			if (link === undefined || link === '') {
				link = oldLink;
			}
			if (active_status === undefined || active_status === '') {
				active_status = oldActive_status;
			}
			if (screen_id === undefined || screen_id === '') {
				screen_id = oldScreen;
			}

			sql.query(`UPDATE "logos" SET link = $1, screen_id = $2, 
		 active_status = $3 WHERE id = $4;`,
				[link, screen_id, active_status, logo_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "logos" where id = $1`, [req.body.logo_id]);
							res.json({
								message: "Logo Updated Successfully!",
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


Logos.UpdateStatus = async (req, res) => {
	if (req.body.logo_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "logos"
		 where id = $1 `, [req.body.logo_id]);

		if (userData.rowCount === 1) {

			const oldActive_status = userData.rows[0].active_status;

			let { logo_id, active_status } = req.body;
			if (link === undefined || link === '') {
				link = oldLink;
			}
			if (active_status === undefined || active_status === '') {
				active_status = oldActive_status;
			}

			sql.query(`UPDATE "logos" SET link = $1, screen_id = $2, 
		 active_status = $3 WHERE id = $4;`,
				[link, screen_id, active_status, logo_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "logos" where id = $1`, [req.body.logo_id]);
							res.json({
								message: "Logo status Updated Successfully!",
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



Logos.Delete = async (req, res) => {
	const data = await sql.query(`select * from logos WHERE id = $1`
		, [req.body.logo_id])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM logos WHERE id = ${req.body.logo_id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Logo Deleted Successfully!",
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


module.exports = Logos;