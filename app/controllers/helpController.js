const { sql } = require('../config/db.config')
exports.send = async (req, res) => {
    const { email, user_id,user_query } = req.body;
    try {
        if (!email || !user_query || !user_id) {
            return res.json({
                status: false,
                message: 'email, user_query and user_id are required'
            })
        }
        const query = `INSERT INTO help (email, query, user_id) VALUES ($1, $2 , $3) RETURNING *`
        const result = await sql.query(query, [email, user_query, user_id]);
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'Could not add'
            })
        }
        res.json({
            status: true,
            message: 'Added Successfully',
            result: result.rows[0]
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}
exports.get = async (req, res) => {
    let { help_id, page, limit } = req.query
    try {
        let result;
        if (!help_id) {
            if (!page || !limit) {
                const query = `SELECT * FROM "help"`
                result = await sql.query(query, [false])
            }
            else {
                limit = parseInt(limit)
                let offset = (parseInt(page) - 1) * limit
                const query = `SELECT * FROM "help" LIMIT $1 OFFSET $2`
                result = await sql.query(query, [limit, offset])
            }
        }
        else {
            const query = `SELECT * FROM "help" WHERE id = $1`
            result = await sql.query(query, [help_id])
        }
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'Could not find results'
            })
        }
        await Promise.all(result.rows.map(async(item,index)=>{
            if(item.user_id){
                const query = `SELECT * FROM "user" WHERE id = $1`
                const super_category = await sql.query(query, [item.user_id]);
                result.rows[index].userData = super_category.rows[0]
            }
        }))
        res.json({
            status: true,
            message: 'Fetched',
            count: result.rowCount,
            result: result.rows
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}
exports.delete = async (req, res) => {
    const { help_id } = req.query
    try {
        if (!help_id) {
            return res.json({
                status: false,
                message: 'help_id is required'
            })
        }
        const query = `DELETE FROM "help" WHERE id = $1 RETURNING *`
        const result = await sql.query(query, [help_id])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'Could not find results'
            })
        }

        res.json({
            status: false,
            message: 'Deleted successfully',
            result: result.rows[0]
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}
exports.deleteAll = async (req, res) => {
    try {
        const query = `DELETE FROM help RETURNING*`
        const result = await sql.query(query);
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'Could not find any results'
            })
        }

        res.json({
            status: false,
            message: 'Deletion successfull',
            result: result.rows
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}