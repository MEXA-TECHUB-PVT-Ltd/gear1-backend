
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SubscriptionPlan = function (SubscriptionPlan) {
	this.name = SubscriptionPlan.name;
	this.price = SubscriptionPlan.price;
	this.no_Img_to_pdf_conversion = SubscriptionPlan.no_Img_to_pdf_conversion;
	this.no_pdf_to_word_conversion = SubscriptionPlan.no_pdf_to_word_conversion;
	this.no_word_to_pdf_conversion = SubscriptionPlan.no_word_to_pdf_conversion;
	this.freeTrail = SubscriptionPlan.freeTrail;
	this.freeTrailDays = SubscriptionPlan.freeTrailDays;
	this.duratin_days = SubscriptionPlan.duratin_days;

};
SubscriptionPlan.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.SubscriptionPlan (
        id SERIAL NOT NULL,
		name text,
        price text ,
        no_Img_to_pdf_conversion text,
		no_pdf_to_word_conversion text,
		no_word_to_pdf_conversion text ,
        freeTrail text,
		freeTrailDays text,
		duratin_days text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.name || req.body.name === '') {
				res.json({
					message: "Please Enter name",
					status: false,
				});
			} else {
				const { name, price, no_Img_to_pdf_conversion,no_pdf_to_word_conversion ,no_word_to_pdf_conversion, 
					freeTrail, freeTrailDays, duratin_days } = req.body;
				const query = `INSERT INTO "subscriptionplan"
				 (id,name, price,no_Img_to_pdf_conversion,no_pdf_to_word_conversion,no_word_to_pdf_conversion ,freeTrail , freeTrailDays,duratin_days ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[name, price, no_Img_to_pdf_conversion, no_pdf_to_word_conversion, no_word_to_pdf_conversion, freeTrail, freeTrailDays, duratin_days]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							freeTrailDays: false,
							err
						});
					}
					else {
						res.json({
							message: "Subscription Plan Added Successfully!",
							status: true,
							result: foundResult.rows,
						});
					}
				} else {
					res.json({
						message: "Try Again",	
						status: false,
						err
					});
				}

			};
		}

	});
}	

SubscriptionPlan.viewSpecificPlan = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscription Plan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}
SubscriptionPlan.viewSubscriptionPlanbyno_Img_to_pdf_conversion = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE ( no_Img_to_pdf_conversion = $1)`, [req.body.no_Img_to_pdf_conversion], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscription Plan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}

SubscriptionPlan.viewSubscriptionPlanFreeTrail = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE ( freeTrail = $1)`, ['yes'], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscription Plan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}


// SubscriptionPlan.viewPayments = async function (req, res) {
// 	const { no_word_to_pdf_conversion  } = req.body;
// 	sql.query(`SELECT * FROM "subscriptionplan" WHERE no_word_to_pdf_conversion = $1`, [no_word_to_pdf_conversion], async (err, results) => {
// 		if (err) {
// 			console.log(err);
// 			res.json({
// 				message: "Try Again",
// 				freeTrailDays: false,
// 				err
// 			});
// 		}
// 		else {
// 			if (results.rows.length == 0) {
// 				res.json({
// 					message: "SubscriptionPlan Not Found",
// 					freeTrailDays: false,
// 				});
// 			} else {
// 				if (bcrypt.compareSync(req.body.validity, results.rows[0].validity)) {
// 					const salt = await bcrypt.genSalt(10);
// 					const hashvalidity = await bcrypt.hash(newvalidity, salt);
// 					sql.query(`UPDATE "subscriptionplan" SET validity = $1 WHERE id = $2`, [hashvalidity, results.rows[0].id], (err, result) => {
// 						if (err) {
// 							console.log(err);
// 							res.json({
// 								message: "Try Again",
// 								freeTrailDays: false,
// 								err
// 							});
// 						}
// 						else {
// 							res.json({
// 								message: "validity Changed Successfully",
// 								freeTrailDays: true,
// 								results: results.rows
// 							});
// 						}
// 					})
// 				}
// 				else {
// 					res.json({
// 						message: "Incorrect validity",
// 						freeTrailDays: false,
// 					});
// 				}

// 			}
// 		}
// 	});

// }


SubscriptionPlan.viewAllPlans = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "SubscriptionPlan Details",
				status: true,
				result: result.rows
			});
		}
	});
}

SubscriptionPlan.ViewAllBlockedSubscriptionPlans = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE freeTrailDays = $1`, ['block'], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "SubscriptionPlan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}
SubscriptionPlan.ViewAllSubscribedSubscriptionPlan = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE freeTrail = $1`, ['subscriber'], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscribed SubscriptionPlan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}

SubscriptionPlan.SpecificSubscriptionPlan = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE id = $1`, [req.body.id], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscribed SubscriptionPlan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}
SubscriptionPlan.AllMemberSubscriptionPlans = (req, res) => {
	sql.query(`SELECT * FROM "subscriptionplan" WHERE freeTrail = $1`, ['member'], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				freeTrailDays: false,
				err
			});
		} else {
			res.json({
				message: "Subscribed SubscriptionPlan Details",
				freeTrailDays: true,
				result: result.rows
			});
		}
	});
}
SubscriptionPlan.changefreeTrailDays = (req, res) => {
	if (req.body.freeTrailDays === '') {
		res.json({
			message: "Please Enter freeTrailDays",
			freeTrailDays: false,
		});
	} else {
		sql.query(`UPDATE "subscriptionplan" SET freeTrailDays = $1 WHERE id = $2;`, [req.body.freeTrailDays, req.body.id], async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					freeTrailDays: false,
					err
				});
			} else {
				if (result.rowCount === 1) {
					const data = await sql.query(`select * from "subscriptionplan" where id = $1`, [req.body.id]);
					res.json({
						message: "SubscriptionPlan Updated Successfully!",
						freeTrailDays: true,
						result: data.rows,
					});
				} else if (result.rowCount === 0) {
					res.json({
						message: "Not Found",
						freeTrailDays: false,
					});
				}
			}
		});
	}
}

SubscriptionPlan.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const SubscriptionPlanData = await sql.query(`select * from "subscriptionplan" where id = $1`, [req.body.id]);
		const oldName = SubscriptionPlanData.rows[0].name;
		const oldprice = SubscriptionPlanData.rows[0].price;
		const oldno_Img_to_pdf_conversion = SubscriptionPlanData.rows[0].no_Img_to_pdf_conversion;
		const oldno_pdf_to_word_conversion = SubscriptionPlanData.rows[0].no_pdf_to_word_conversion;
		const oldno_word_to_pdf_conversion = SubscriptionPlanData.rows[0].no_word_to_pdf_conversion;
		const oldfreeTrail = SubscriptionPlanData.rows[0].freeTrail;
		const oldfreeTrailDays = SubscriptionPlanData.rows[0].freeTrailDays;
		const oldduratin_days = SubscriptionPlanData.rows[0].duratin_days;
		let { id, name, price, no_Img_to_pdf_conversion,no_pdf_to_word_conversion, no_word_to_pdf_conversion , freeTrail, freeTrailDays , duratin_days} = req.body;
		if (name === undefined || name === '') {
			name = oldName;
		}
		if (price === undefined || price === '') {
			price = oldprice;
		}
		if (no_Img_to_pdf_conversion === undefined || no_Img_to_pdf_conversion === '') {
			no_Img_to_pdf_conversion = oldno_Img_to_pdf_conversion;
		}
		if (no_pdf_to_word_conversion === undefined || no_pdf_to_word_conversion === '') {
            no_pdf_to_word_conversion = oldno_pdf_to_word_conversion;
        }
		if (no_word_to_pdf_conversion === undefined || no_word_to_pdf_conversion === '') {
			no_word_to_pdf_conversion = oldno_word_to_pdf_conversion;
		}
		if (freeTrail === undefined || freeTrail === '') {
            freeTrail = oldfreeTrail;
        }
		if (freeTrailDays === undefined || freeTrailDays === '') {
            freeTrailDays = oldfreeTrailDays;
        }
		if (duratin_days === undefined || duratin_days === '') {
            duratin_days = oldduratin_days;
        }
		sql.query(`UPDATE "subscriptionplan" SET name = $1, price = $2, 
		no_Img_to_pdf_conversion = $3, no_pdf_to_word_conversion = $4, no_word_to_pdf_conversion = $5 , freeTrail = $6,
		freeTrailDays = $7, duratin_days = $8  WHERE id = $9;`,
			[name, price, no_Img_to_pdf_conversion, no_pdf_to_word_conversion, no_word_to_pdf_conversion, freeTrail, freeTrailDays ,duratin_days, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "subscriptionplan" where id = $1`, [req.body.id]);
						res.json({
							message: "Subscription Plan Updated Successfully!",
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
	}
}


SubscriptionPlan.delete = async (req, res) => {
	const data = await sql.query(`select * from "subscriptionplan" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "subscriptionplan" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Subscription Plan Deleted Successfully!",
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
module.exports = SubscriptionPlan;