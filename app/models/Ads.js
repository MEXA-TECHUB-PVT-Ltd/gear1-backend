const { sql } = require("../config/db.config");

const ads = function (ads) {
	this.image = ads.image
	this.ad_name = ads.ad_name
	this.link = ads.link;
	this.screen_id = ads.screen_id;
	this.active_status = ads.active_status;


};
ads.Add = async (req, res) => {
	const user = await sql.query(`select * from "screens" WHERE id = $1`
		, [req.body.screen_id])
	if (!req.body.screen_id || req.body.screen_id === '') {
		res.json({
			message: "Please Enter screen ID",
			status: false,
		});
	} else if (user.rowCount > 0) {
		sql.query(`CREATE TABLE IF NOT EXISTS public.ads (
        id SERIAL NOT NULL,
        image text,
		ad_name text,
        link text,
		screen_id SERIAL NOT NULL,
        active_status text,
		report_ad boolean,
		report_ad_by text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {

				sql.query(`INSERT INTO ads (id ,ad_name, link, screen_id, active_status, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3 ,$4,  'NOW()', 'NOW()') RETURNING * `
					, [req.body.ad_name, req.body.link, req.body.screen_id, 'active'], async (err, result) => {
						if (err) {
							console.log(err);
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							const History = await sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, action_table ,createdAt ,updatedAt )
							VALUES (DEFAULT, $1  ,  $2, $3,  $4 , 'NOW()', 'NOW()') RETURNING * `
								, [req.body.user_id, result.rows[0].id, 'add ads', 'ads'])
							res.json({
								message: "Ad's added Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
		});
	} else {
		res.json({
			message: "Entered Screen ID is not present",
			status: false,
		});
	}
}

ads.addImage = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "ads" where id = $1`, [req.body.id]);
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

			sql.query(`UPDATE "ads" SET image = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "ads" where id = $1`, [req.body.id]);
							res.json({
								message: "Ad Image added Successfully!",
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


ads.UpdateStatus = async (req, res) => {
	if (req.body.adID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "ads"
		 where id = $1 `, [req.body.adID]);

		if (userData.rowCount === 1) {

			const oldActive_status = userData.rows[0].active_status;

			let { adID, active_status } = req.body;
			if (active_status === undefined || active_status === '') {
				active_status = oldActive_status;
			}

			sql.query(`UPDATE "ads" SET active_status = $1 WHERE id = $2;`,
				[active_status, adID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "ads" where id = $1`, [req.body.adID]);
							res.json({
								message: "ad status Updated Successfully!",
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



ads.Get = (req, res) => {
	sql.query(`SELECT * FROM "ads" WHERE id = $1 `
		, [req.body.adID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Ad's Data",
					status: true,
					result: result.rows,
				});
			}
		});

}

ads.GetAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS AllAds FROM "ads"`)
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT "ads".*, "screens".name AS screen_name FROM "ads" JOIN "screens"
		ON "ads".screen_id = "screens".id ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "ads".*, "screens".name AS screen_name FROM "ads" JOIN "screens"
		ON "ads".screen_id = "screens".id ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rowCount > 0) {
		for (let i = 0; i < result.rowCount; i++) {
			result.rows[i] = {
				...result.rows[i],
				type: 'ad'
			}
		}
	}
	if (result.rows) {
		res.json({
			message: "Ad's Data",
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

ads.GetByScreen = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS AllAds FROM "ads" where screen_id = $1 `,
		[req.body.screen_id])
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT "ads".*, "screens".name AS screen_name FROM "ads" JOIN "screens"
		ON "ads".screen_id = "screens".id where screen_id = $1 ORDER BY "createdat" DESC `,
			[req.body.screen_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "ads".*, "screens".name AS screen_name FROM "ads" JOIN "screens"
		ON "ads".screen_id = "screens".id where screen_id = $1 ORDER BY "createdat" DESC
		LIMIT $2 OFFSET $3 ` , [req.body.screen_id, limit, offset]);
	}
	if (result.rowCount > 0) {
		for (let i = 0; i < result.rowCount; i++) {
			result.rows[i] = {
				...result.rows[i],
				type: 'ad'
			}
		}
	}

	if (result.rows) {
		res.json({
			message: "Ad's Data by Screen",
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

ads.GetActiveByScreen = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS AllAds FROM "ads" 
	WHERE screen_id = $1 AND active_status = $2`, [req.body.screen_id, 'active'])

	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT *  FROM "ads" WHERE screen_id = $1 AND active_status = $2`
			, [req.body.screen_id, 'active']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "ads".*, "screens".name AS screen_name FROM "ads" JOIN "screens"
		ON "ads".screen_id = "screens".id WHERE screen_id = $1 AND active_status = $2 ORDER BY "createdat" DESC
		LIMIT $3 OFFSET $4 ` , [req.body.screen_id, 'active', limit, offset]);
	}
	if (result.rowCount > 0) {
		for (let i = 0; i < result.rowCount; i++) {
			result.rows[i] = {
				...result.rows[i],
				type: 'ad'
			}
		}
	}

	if (result.rows) {
		res.json({
			message: "Active Ad's Data by Screen",
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


ads.Update = async (req, res) => {
	if (req.body.adID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "ads"
		 where id = $1 `, [req.body.adID]);

		if (userData.rowCount === 1) {
			const oldLink = userData.rows[0].link;
			const oldAd_name = userData.rows[0].ad_name;
			const oldScreen = userData.rows[0].screen_id;
			const oldActive_status = userData.rows[0].active_status;

			let { adID, ad_name, link, screen_id, active_status } = req.body;
			if (link === undefined || link === '') {
				link = oldLink;
			}
			if (ad_name === undefined || ad_name === '') {
				ad_name = oldAd_name;
			}
			if (active_status === undefined || active_status === '') {
				active_status = oldActive_status;
			}

			if (active_status === undefined || active_status === '') {
				active_status = oldActive_status;
			}
			if (screen_id === undefined || screen_id === '') {
				screen_id = oldScreen;
			}

			sql.query(`UPDATE "ads" SET link = $1, screen_id = $2, 
		 active_status = $3 WHERE id = $4;`,
				[link, screen_id, active_status, adID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "ads" where id = $1`, [req.body.adID]);
							res.json({
								message: "Ad Updated Successfully!",
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


ads.Delete = async (req, res) => {
	const data = await sql.query(`select * from ads WHERE id = $1`
		, [req.body.adID])
	if (data.rows.length > 0) {
		sql.query(`DELETE FROM ads WHERE id = ${req.body.adID};`, async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {

				const query1 = 'DELETE FROM report_ads WHERE report_id = $1 ';
				const result1 = await sql.query(query1, [req.body.adID]);
				res.json({
					message: "Ad's Deleted Successfully!",
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


module.exports = ads;
