const { sql } = require("../config/db.config");
const schedule = require('node-schedule');

const DailyDeals = function (DailyDeals) {
	this.image = DailyDeals.image;
	this.description = DailyDeals.description;
	this.title = DailyDeals.title;
	this.ends_at = DailyDeals.ends_at;
	this.status = DailyDeals.status;
};

DailyDeals.Add = async (req, res) => {
	if (!req.body.description || req.body.description === '') {
		res.json({
			message: "Please Enter description",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.dailydeals (
        id SERIAL NOT NULL,
        image TEXT,
		description text,
        title text,
		ends_at text,
        status text,
        createdat timestamp NOT NULL,
        updatedat timestamp ,
        PRIMARY KEY (id));` , (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				sql.query(`INSERT INTO dailydeals (id ,description, title ,ends_at,status, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1 ,  $2, $3, $4, 'NOW()', 'NOW()') RETURNING * `
					, [req.body.description, req.body.title, req.body.ends_at,
					req.body.status], (err, result) => {
						if (err) {
							console.log(err);
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							console.log(result.rows[0].id);
							if (req.body.status === 'active') {
								// 86400000 ===== 24 hours
								const startTime = new Date(Date.now() + 86400000);
								const endTime = new Date(startTime.getTime() + 1000);
								let job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function () {
									const userData = await sql.query(`UPDATE "dailydeals" SET status = $1
									 WHERE id = $2;`, ['inactive', result.rows[0].id]);
									console.log('status Change!');

								});
							}
							res.json({
								message: "Daily Deal added Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
		});
	}
}

DailyDeals.addImages = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "dailydeals" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].image;

			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "dailydeals" SET image = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "dailydeals" where id = $1`, [req.body.id]);
							res.json({
								message: "Deal Image Added Successfully!",
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

DailyDeals.GetADailyDeal = (req, res) => {
	sql.query(`SELECT * FROM "dailydeals" WHERE id = $1 `
		, [req.body.DailyDeal_ID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "daily deal data",
					status: true,
					result: result.rows,
				});
			}
		});

}

DailyDeals.GetAllDailyDeals = (req, res) => {
	sql.query(`SELECT * FROM "dailydeals" `
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
					message: "ALL dailydeals data",
					status: true,
					result: result.rows,
				});
			}
		});

}

DailyDeals.GetAllActiveDeals = (req, res) => {
	sql.query(`SELECT * FROM "dailydeals" WHERE status = $1 `
		, ['active'], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Active daily deals",
					status: true,
					result: result.rows,
				});
			}
		});

}

DailyDeals.UpdateStatus = async (req, res) => {
	if (req.body.DailyDeal_ID === '') {
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
		const userData = await sql.query(`select * from "dailydeals" where id = $1 
		`, [req.body.DailyDeal_ID]);

		if (userData.rowCount === 1) {
			const oldstatus = userData.rows[0].status;

			let { DailyDeal_ID, status } = req.body;
			if (status === undefined || status === '') {
				status = oldCategory_id;
			}
			sql.query(`UPDATE "dailydeals" SET status = $1  WHERE id = $2;`,
				[ status, DailyDeal_ID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "dailydeals" where id = $1`, [req.body.DailyDeal_ID]);
							if (req.body.status === 'active') {
								// 86400000 ===== 24 hours
								const startTime = new Date(Date.now() + 86400000);
								const endTime = new Date(startTime.getTime() + 1000);
								let job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function () {
									const userData = await sql.query(`UPDATE "dailydeals" SET status = $1
									 WHERE id = $2;`, ['inactive', result.rows[0].id]);
									console.log('status Change!');

								});
							}
							res.json({
								message: "Daily Deal's Status Updated Successfully!",
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

DailyDeals.Update = async (req, res) => {
	if (req.body.DailyDeal_ID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "dailydeals" where id = $1 
		`, [req.body.DailyDeal_ID]);

		if (userData.rowCount === 1) {

			const oldName = userData.rows[0].title;
			const oldstatus = userData.rows[0].status;
			const oldPrice = userData.rows[0].ends_at;
			const oldDescription = userData.rows[0].description;

			let { DailyDeal_ID, title, status, ends_at, description } = req.body;
			if (title === undefined || title === '') {
				title = oldName;
			}
			if (status === undefined || status === '') {
				status = oldstatus;
			}
			if (ends_at === undefined || ends_at === '') {
				ends_at = oldPrice;
			}

			if (description === undefined || description === '') {
				description = oldDescription;
			}
			sql.query(`UPDATE "dailydeals" SET title = $1, status = $2, 
		ends_at = $3, description = $4 WHERE id = $5;`,
				[title, status, ends_at, description, DailyDeal_ID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "dailydeals" where id = $1`, [req.body.DailyDeal_ID]);
							if (req.body.status === 'active') {
								// 86400000 ===== 24 hours
								const startTime = new Date(Date.now() + 86400000);
								const endTime = new Date(startTime.getTime() + 1000);
								let job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function () {
									const userData = await sql.query(`UPDATE "dailydeals" SET status = $1
									 WHERE id = $2;`, ['inactive', result.rows[0].id]);
									console.log('status Change!');

								});
							}
							res.json({
								message: "Daily Deal Updated Successfully!",
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


DailyDeals.Delete = async (req, res) => {
	const data = await sql.query(`select * from dailydeals WHERE id = $1 `
		, [req.body.DailyDeal_ID])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM dailydeals WHERE id = ${req.body.DailyDeal_ID};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Daily Deal Deleted Successfully!",
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


module.exports = DailyDeals;