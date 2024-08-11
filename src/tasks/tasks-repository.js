const { db } = require('../../db/config');

exports.createTaskQuery = async (taskItems, next) => {
    const keys = Object.keys(taskItems);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${taskItems[key]}'`).join(', ');
    const sql = `INSERT INTO tasks (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}