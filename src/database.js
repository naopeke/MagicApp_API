const mysql = require("mysql2");

// const connection = mysql.createConnection({
//     host:       process.env.DB_HOST         || "magydeck.c92woie8epi1.eu-west-3.rds.amazonaws.com",
//     user:       process.env.DB_USER         || "admin",
//     password:   process.env.DB_PASSWORD     || "magydeck2024*",
//     database:   process.env.DB_NAME         || "magydeck",
//     port:       process.env.DB_PORT         || 3306
// })

const pool = mysql.createPool({
    host:       process.env.DB_HOST         || "magydeck.c92woie8epi1.eu-west-3.rds.amazonaws.com",
    user:       process.env.DB_USER         || "admin",
    password:   process.env.DB_PASSWORD     || "magydeck2024*",
    database:   process.env.DB_NAME         || "magydeck",
    port:       process.env.DB_PORT         || 3306
    }).promise();


console.log('Conexión con la BBDD creada');

// module.exports = { connection };

module.exports = { pool };