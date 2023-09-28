const { sql } = require("../config/db.config");

exports.generate = async (req,res) => {
    const {item_id} = req.query;
	try {
		if(!item_id){
            return res.json({
                status: false,
                message:'item_id is required'
            })
        }
        const url = `http://localhost:3000/gearOne/ItemDetails/${item_id}`
        return res.send(url);
	}
	catch (err) {
        res.json({
            status:false,
            message:err.message
        })
	}
}
