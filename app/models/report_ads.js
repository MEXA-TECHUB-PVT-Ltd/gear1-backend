const { sql } = require("../config/db.config");

const report_ads = function (report_ads) {
	this.report_id = report_ads.report_id
	this.report_by = report_ads.report_by;


};
report_ads.Add = async (req, res) => {
	const user = await sql.query(`select * from "ads" WHERE id = $1`
		, [req.body.report_id])
	if (!req.body.report_id || req.body.report_id === '') {
		res.json({
			message: "Please Enter Report ID",
			status: false,
		});
	} else if (user.rowCount > 0) {
		sql.query(`CREATE TABLE IF NOT EXISTS public.report_ads (
        id SERIAL NOT NULL,
		report_id text,
        report_by text,
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
				sql.query(`INSERT INTO report_ads (id ,report_id, report_by, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') RETURNING * `
					, [req.body.report_id, req.body.report_by], (err, result) => {
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
								message: "Ad Reported Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
		});
	} else {
		res.json({
			message: "Entered Report ID is not present",
			status: false,
		});
	}
}

report_ads.ViewSpecific = (req, res) => {
	sql.query(`SELECT "report_ads".id AS report_id, "report_ads".createdat AS report_create_by,   "ads".*, "user"."id" AS user_id, "user"."username" AS user_name,
	"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
	"user"."phone" AS phone , "user"."country_code" AS country_code
	FROM "report_ads"
	JOIN "ads" ON "report_ads".report_id::integer = "ads".id
	JOIN "user" ON "user"."id" = "report_ads".report_by::integer
	WHERE "report_ads".id = $1; `
		, [req.body.report_id], (err, result) => {
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
report_ads.reportBy_UserID = (req, res) => {
	sql.query(`SELECT "report_ads".id AS report_id, "report_ads".createdat AS report_create_by,   "ads".*, "user"."id" AS user_id, "user"."username" AS user_name,
	"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
	"user"."phone" AS phone , "user"."country_code" AS country_code
	FROM "report_ads"
	JOIN "ads" ON "report_ads".report_id::integer = "ads".id
	JOIN "user" ON "user"."id" = "report_ads".report_by::integer
	WHERE "report_ads".report_id = $1 AND "report_ads".report_by = $2; `
		, [req.body.ad_id, req.body.user_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				if (result.rowCount > 0) {
					res.json({
						message: 'Reported by That user',
						status: true,
						result: result.rows,
					});
				} else {
					res.json({
						message: 'Not Reported by That user',
						status: false,
					});

				}
			}
		});

}

report_ads.ViewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "report_ads"`)
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT "report_ads".id AS report_id, "report_ads".createdat AS report_create_by,  "ads".*, "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code
		FROM "report_ads"
		JOIN "ads" ON "report_ads".report_id::integer = "ads".id
		JOIN "user" ON "user"."id" = "report_ads".report_by::integer
	 ORDER BY "id" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "report_ads".id AS report_id, "report_ads".createdat AS report_create_by,  "ads".*, "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code
		FROM "report_ads"
		JOIN "ads" ON "report_ads".report_id::integer = "ads".id
		JOIN "user" ON "user"."id" = "report_ads".report_by::integer ORDER BY "id" DESC
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

report_ads.getCount = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "report_ads" where report_id  = $1 `,
		[req.body.ad_id])
	sql.query(`SELECT "report_ads".id AS report_id, "report_ads".createdat AS report_create_by,   "ads".*, "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code
		FROM "report_ads"
		JOIN "ads" ON "report_ads".report_id::integer = "ads".id
		JOIN "user" ON "user"."id" = "report_ads".report_by::integer
		WHERE "report_ads".report_id = $1; `
		, [req.body.ad_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "ad's Reported data",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});
}




report_ads.Delete = async (req, res) => {
	const data = await sql.query(`select * from report_ads WHERE id = $1`
		, [req.body.report_id])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM report_ads WHERE id = ${req.body.report_id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Ad's report Deleted Successfully!",
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


module.exports = report_ads;
