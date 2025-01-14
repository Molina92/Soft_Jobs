const { DB } = require("../config/db");
const pgFormat = require('pg-format');

const authenticateUser = async (email) => {
    try {
        const SQLQuery = pgFormat(
            `SELECT * FROM usuarios
            WHERE email = %L`,
            email
        );

        const result = await DB.query(SQLQuery);
        
        if (!result.rowCount) throw new Error('USER_NOT_FOUND');
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const getUser = async (email) => {
    try {
        const result = await DB.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0];

    } catch (error) {
        throw error;
    }
};

const createUser = async (email, hashedPassword, rol, lenguage) => {
    try {
        const SQLQuery = `
            INSERT INTO usuarios (email, password, rol, lenguage)
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;

        const result = await DB.query(SQLQuery, [email, hashedPassword, rol, lenguage]);
        return result.rows[0];

    } catch (error) {
        throw error;
    }
};

module.exports = {
    authenticateUser,
    getUser,
    createUser
};