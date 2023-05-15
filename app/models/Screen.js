const {sql} = require("../config/db.config");

const Screen = function (Screen) {
	this.name = Screen.name;
};

Screen.Add = async (req, res) => {
	if (!req.body.name || req.body.name === '') {
		res.json({
			message: "Please Enter Screen name",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.screens (
        id SERIAL,
        name text NOT NULL,
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
				sql.query(`INSERT INTO "screens" (id, name , createdAt ,updatedAt )
                            VALUES (DEFAULT, $1 , 'NOW()', 'NOW()') 
							RETURNING * `,[req.body.name], (err, result) => {
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
							message: "Screen for Ad Added Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}

Screen.GetScreen  = (req, res) => {
	sql.query(`SELECT * FROM "screens" WHERE id = ${req.body.ScreenID};`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Specific Screen Details",
				status: true,
				result: result.rows
			});
		}
	});
}

Screen.GetAllScreen = (req, res) => {
	sql.query(`SELECT * FROM "screens";`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All screens Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

Screen.Update = async (req, res) => {
	if (req.body.ScreenID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "screens" where id = $1 
		`, [req.body.ScreenID]);

		if (userData.rowCount === 1) {

			const oldName = userData.rows[0].name;

			let { ScreenID, name } = req.body;
			if (name === undefined || name === '') {
				name = oldName;
			}
			sql.query(`UPDATE "screens" SET name = $1 WHERE id = $2;`,
				[name, ScreenID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "screens" where id = $1`, [req.body.ScreenID]);
							res.json({
								message: "Screen Updated Successfully!",
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


Screen.Delete = async (req, res) => {
	const data = await sql.query(`select * from "screens" where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM screens WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Screen Deleted Successfully!",
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
module.exports = Screen;