const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Location = function (Location) {
	this.location_name = Location.location_name;
	this.user_ID = Location.user_ID;;
};

Location.Add = async (req, res) => {
	if (!req.body.location_name || req.body.location_name === '') {
		res.json({
			message: "Please Enter location_name",
			status: false,
		});
	} else if (!req.body.user_ID) {
		res.json({
			message: "Please Enter user_ID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.locations (
        id SERIAL,
        location_name text,
        user_id SERIAL NOT NULL,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));  ` , (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				sql.query(`INSERT INTO locations (id, location_name , user_id, createdat ,updatedat )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') 
							RETURNING * `,[req.body.location_name, req.body.user_ID], (err, result) => {
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
							message: "Location Added Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}

Location.ViewAllLocationUser = (req, res) => {
	sql.query(`SELECT  "user".username, "user".email , "user".phone,
	"user".country_code, "user".image AS User_Image ,"user".cover_image
	 AS Cover_Image ,"user".status ,
	"locations".location_name FROM "locations" JOIN "user" 
	ON "locations".user_id = "user".id where "locations".user_id = $1;`,[req.body.user_ID], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All Location Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

Location.ViewAllLocation = (req, res) => {
	sql.query(`SELECT  "user".username, "user".email , "user".phone,
	"user".country_code, "user".image AS User_Image ,"user".cover_image
	 AS Cover_Image ,"user".status ,
	"locations".location_name FROM "locations" JOIN "user" 
	ON "locations".user_id = "user".id`, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "All Location Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

Location.ViewALocation = (req, res) => {
	sql.query(`SELECT  "user".username, "user".email , "user".phone,
	"user".country_code, "user".image AS User_Image ,"user".cover_image
	 AS Cover_Image ,"user".status ,
	"locations".location_name FROM "locations" JOIN "user" 
	ON "locations".user_id = "user".id where "locations".id = $1;`,[req.body.Location_ID], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Location Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

Location.Update = (req, res) => {
	if (!req.body.location_name || req.body.location_name === '') {
		res.json({
			message: "Please Enter your location_name",
			status: false,
		});
	} else if (req.body.Location_ID === '') {
		res.json({
			message: "Please Enter your Location_ID",
			status: false,
		});
	} else {
		sql.query(`UPDATE locations SET location_name = $1 WHERE
		 id = $2;`, [req.body.location_name, req.body.Location_ID] ,async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				if(result.rowCount === 1){	
				const data = await sql.query(`select * from locations where id = ${req.body.Location_ID}`);
				res.json({
					message: "Location Updated Successfully!",
					status: true,
					result:  data.rows,
				});
			}else if(result.rowCount === 0){
				res.json({
                    message: "Not Found",
                    status: false,
                });
			}
			}
		});
	}
}

module.exports = Location;