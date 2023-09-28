const { sql } = require('../config/db.config');
exports.addOrRemove = async (req, res) => {
    const { user_id, second_user, action } = req.body;
    try {
        if (!user_id || !second_user || !action) {
            return res.json({
                status: false,
                message: 'user_id, second_user_Id and action is required'
            })
        }
        if (action != 'block' && action != 'unblock') {
            return res.json({
                status: false,
                message: 'action must be block or unblock'
            })
        }
        console.log('1')
        const userDataQuery = `SELECT * FROM "user" WHERE id = $1 `
        const userData = await sql.query(userDataQuery, [user_id])
        console.log('2')
        if (userData.rows.length == 0) {
            return res.json({
                status: false,
                message: 'user_id not exsists'
            })
        }
        const secondUserDataQuery = `SELECT * FROM "user" WHERE id = $1 `
        const secondUserData = await sql.query(secondUserDataQuery, [second_user])
        if (secondUserData.rows.length == 0) {
            return res.json({
                status: false,
                message: 'second_user_id not exsists'
            })
        }
        const query = `SELECT * FROM user_block_list WHERE user_id = $1`
        const data = await sql.query(query, [user_id]);
        if (action == 'block') {
            if (data.rows.length == 0) {
                const insertQuery = `INSERT INTO user_block_list(user_id, blocked) VALUES ($1, $2) RETURNING*`
                const insertData = await sql.query(insertQuery, [user_id, [second_user]])
                return res.json({
                    status: true,
                    message: 'user block list created successfully',
                    result:insertData.rows[0]
                })

            }
            else {
                if(data.rows[0].blocked.includes(second_user)) {
                    return res.json({
                        status: false,
                        message: 'user already blocked'
                    })
                }
                const updateQuery = `UPDATE user_block_list SET blocked = array_append(blocked, $1) WHERE user_id = $2 RETURNING*`
                const updateData = await sql.query(updateQuery, [second_user, user_id])
                return res.json({
                    status: true,
                    message: 'user block list updated successfully',
                    result:updateData.rows[0]
                })
            }
        }
        else {
            if (data.rows.length == 0) {
                return res.json({
                    status: false,
                    message: 'user block list does not exsists'
                })

            } else {
                const updateQuery = `UPDATE user_block_list SET blocked = array_remove(blocked, $1) WHERE user_id = $2 RETURNING*`
                const updateData = await sql.query(updateQuery, [second_user, user_id])
                return res.json({
                    status: true,
                    message: 'user block list updated successfully',
                    result:updateData.rows[0]
                })
            }
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}
exports.getByUser = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) {
            return res.json({
                status: false,
                message: 'user id is required'
            })
        }
        const query = `SELECT * FROM user_block_list WHERE user_id = $1`
        const result = await sql.query(query, [id]);
        if (result.rows.length == 0) {
            return res.json({
                status: false,
                message: 'user block list does not exsists'
            })
        }
        await Promise.all(result.rows.map(async (item, index) => {
            if (item.user_id) {
                const userDataQuery = `SELECT * FROM "user" WHERE id = $1 `
                const userData = await sql.query(userDataQuery, [item.user_id])
                result.rows[index].user_data = userData.rows[0]
            }
            if (item.blocked) {
                const blockedDataQuery = `SELECT * FROM "user" WHERE id = ANY($1) `
                const blockedData = await sql.query(blockedDataQuery, [item.blocked])
                result.rows[index].blockedData = blockedData.rows
            }
        }))
        res.json({
            status: false,
            message: 'fetched',
            result: result.rows
        })
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}
exports.checkBlockedUser = async (req, res) => {
    const { user_id, second_user } = req.query;
    try {
        if (!user_id || !second_user) {
            return res.json({
                status: false,
                message: 'user_id, second_user_Id and action is required'
            })
        }
        const query = `SELECT * FROM user_block_list WHERE user_id = $1`
        const result = await sql.query(query, [user_id]);
        if (result.rows.length == 0) {
            return res.send(false)
        }
        if (result.rows[0]?.blocked?.includes(parseInt(second_user))) {
            return res.send(true)
        }
        else {
            return res.send(false)
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}