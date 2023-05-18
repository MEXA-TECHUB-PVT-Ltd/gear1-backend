const { sql } = require("../config/db.config");

const SocialMedia = function (SocialMedia) {
	this.userid = SocialMedia.userid
	this.facebook = SocialMedia.facebook;
	this.twitter = SocialMedia.twitter;
	this.insta = SocialMedia.insta;
	this.linkedin = SocialMedia.linkedin;

};

SocialMedia.Add = async (req, res) => {
	const user = await sql.query(`select * from "user" WHERE id = $1`
		, [req.body.user_ID])
	if (!req.body.userID || req.body.userID === '') {
		res.json({
			message: "Please Enter userID",
			status: false,
		});
	} else if (user.rowCount > 0) {
		sql.query(`CREATE TABLE IF NOT EXISTS public.socialmedia (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        facebook text,
		twitter text,
        insta text,
        linkedin text,
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
				sql.query(`INSERT INTO socialmedia (id, userid , facebook,twitter,insta,linkedin, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, $3, $4, $5 ,  'NOW()', 'NOW()') RETURNING * `
					, [req.body.userID, req.body.facebook, req.body.twitter,
					req.body.insta, req.body.linkedin], (err, result) => {
						if (err) {

							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							res.json({
								message: "Social Media Links added Successfully!",
								status: true,
								result: result.rows,
							});
						}

					})

			};
		});
	} else {
		res.json({
			message: "Entered User ID is not present",
			status: false,
		});
	}

}
SocialMedia.Get = (req, res) => {
	sql.query(`SELECT * FROM "socialmedia" WHERE id = $1 AND userid = $2`
		, [req.body.SocialMediaID, req.body.userID], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Social Media Links",
					status: true,
					result: result.rows,
				});
			}
		});

}


SocialMedia.Update = async (req, res) => {
	if (req.body.SocialMediaID === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "socialmedia" where id = $1 
		AND userid = $2`, [req.body.SocialMediaID, req.body.userID]);

		if (userData.rowCount === 1) {

			const oldFacebook = userData.rows[0].facebook;
			const oldInsta = userData.rows[0].insta;
			const oldTwitter = userData.rows[0].twitter;
			const oldLinkedin = userData.rows[0].linkedin;

			let { SocialMediaID, facebook, insta, twitter, linkedin } = req.body;
			if (facebook === undefined || facebook === '') {
				facebook = oldFacebook;
			}
			if (insta === undefined || insta === '') {
				insta = oldInsta;
			}
			if (twitter === undefined || twitter === '') {
				twitter = oldTwitter;
			}

			if (linkedin === undefined || linkedin === '') {
				linkedin = oldLinkedin;
			}
			sql.query(`UPDATE "socialmedia" SET facebook = $1, insta = $2, 
		twitter = $3, linkedin = $4 WHERE id = $5;`,
				[facebook, insta, twitter, linkedin, SocialMediaID], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "socialmedia" where id = $1`, [req.body.SocialMediaID]);
							res.json({
								message: "Social Media Links Updated Successfully!",
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


SocialMedia.Delete = async (req, res) => {
	const data = await sql.query(`select * from socialmedia WHERE id = $1 AND userid = $2`
		, [req.body.SocialMediaID, req.body.userID])
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM socialmedia WHERE id = ${req.body.SocialMediaID};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Social Media Links Deleted Successfully!",
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


module.exports = SocialMedia;