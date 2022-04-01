const sqlite3 = require('sqlite3').verbose();
module.exports = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);