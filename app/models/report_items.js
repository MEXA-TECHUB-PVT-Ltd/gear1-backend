const { sql } = require("../config/db.config");

const report_items = function (report_items) {
	this.report_id = report_items.report_id
	this.report_by = report_items.report_by;


};
report_items.Add = async (req, res) => {
	const user = await sql.query(`select * from "items" WHERE id = $1`
		, [req.body.report_id])
	if (!req.body.report_id || req.body.report_id === '') {
		res.json({
			message: "Please Enter Report ID",
			status: false,
		});
	} else if (user.rowCount > 0) {
		sql.query(`CREATE TABLE IF NOT EXISTS public.report_items (
        id SERIAL NOT NULL,
		report_id text,
        report_by text,
		report_reason text,
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
				sql.query(`INSERT INTO report_items (id ,report_id, report_by, createdAt ,updatedAt, report_reason )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()', $3) RETURNING * `
					, [req.body.report_id, req.body.report_by, req.body.report_reason], (err, result) => {
						if (err) {
							console.log(err);
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							const History = sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, action_table ,createdAt ,updatedAt )
							VALUES (DEFAULT, $1  ,  $2, $3,  $4 , 'NOW()', 'NOW()') RETURNING * `
								, [req.body.report_by, req.body.report_id, 'report Item', 'items'])			
							res.json({
								message: "Item Reported Successfully!",
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

report_items.ViewSpecific = (req, res) => {
	sql.query(`SELECT "report_items".id AS report_id,"report_items".report_reason AS report_reason, "report_items".createdat AS report_create_by,
	   "items".*, "user"."id" AS user_id, "user"."username" AS user_name,
	"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
	"user"."phone" AS phone , "user"."country_code" AS country_code
	FROM "report_items"
	JOIN "items" ON "report_items".report_id::integer = "items".id
	JOIN "user" ON "user"."id" = "report_items".report_by::integer
	WHERE "report_items".id = $1; `
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
report_items.reportBy_UserID = (req, res) => {
	sql.query(`SELECT "report_items".id AS report_id,"report_items".report_reason AS report_reason, "report_items".createdat AS report_create_by, 
	  "items".*, "user"."id" AS user_id, "user"."username" AS user_name,
	"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
	"user"."phone" AS phone , "user"."country_code" AS country_code
	FROM "report_items"
	JOIN "items" ON "report_items".report_id::integer = "items".id
	JOIN "user" ON "user"."id" = "report_items".report_by::integer
	WHERE "report_items".report_id = $1 AND "report_items".report_by = $2; `
		, [req.body.item_id, req.body.user_id], (err, result) => {
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

report_items.ViewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "report_items"`)
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT 
		"report_items".id AS id,"report_items".report_reason AS report_reason, "report_items".createdat AS report_create_by, 


		 "items".name AS item_name ,    "items".id AS item_id, "items".price AS item_price, 
		 "items".location AS item_location, "items".added_by AS item_added_by,
		 "items".promoted AS item_promoted, "items".description AS description,

		 "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code

		FROM "report_items"
		JOIN "items" ON "report_items".report_id::integer = "items".id
		JOIN "user" ON "user"."id" = "report_items".report_by::integer
	 ORDER BY report_items."id" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "report_items".id AS report_id, "report_items".createdat AS report_create_by,
		  "items".* AS items, "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code
		FROM "report_items"
		JOIN "items" ON "report_items".report_id::integer = "items".id
		JOIN "user" ON "user"."id" = "report_items".report_by::integer ORDER BY "id" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
		res.json({
			message: "Item's Reports's Data",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
}

report_items.getCount = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "report_items" where report_id  = $1 `,
		[req.body.item_id])
	sql.query(`SELECT "report_items".id AS report_id,"report_items".report_reason AS report_reason, "report_items".createdat AS report_create_by,   "items".*, "user"."id" AS user_id, "user"."username" AS user_name,
		"user"."email" AS email ,"user"."image" AS image ,"user"."cover_image" AS cover_image ,
		"user"."phone" AS phone , "user"."country_code" AS country_code
		FROM "report_items"
		JOIN "items" ON "report_items".report_id::integer = "items".id
		JOIN "user" ON "user"."id" = "report_items".report_by::integer
		WHERE "report_items".report_id = $1; `
		, [req.body.item_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "items's Reported data",
					status: true,
					count: data.rows[0].count,
					result: result.rows,
				});
			}
		});
}




report_items.Delete = async (req, res) => {
	const data = await sql.query(`select * from report_items WHERE id = $1`
		, [req.body.report_id])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM report_items WHERE id = ${req.body.report_id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "items's report Deleted Successfully!",
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


module.exports = report_items;
