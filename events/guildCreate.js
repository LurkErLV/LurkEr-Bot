const db = require('../db/database');

module.exports = {
  name: "guildCreate",
  once: false,
  execute(interaction) {
    const guild = interaction.id;

      db.get(
        `SELECT * FROM variables WHERE server_id = ?`,
        [guild],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!row) {
            db.run(`INSERT INTO variables VALUES (?, ?, ?)`, [
              guild,
              null,
              null,
            ]);
          }
        }
      );

      db.run(`CREATE TABLE IF NOT EXISTS "${guild}"
      (
          userid      INTEGER NOT NULL,
          xp          INTEGER NOT NULL,
          level       INTEGER NOT NULL,
          tonextlevel INTEGER NOT NULL
      )`);
  },
};
