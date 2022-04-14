const db = require("../db/database");
const Discord = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(member) {
    if (member.author.bot) return;
    const guildId = member.guild.id;
    const memberId = member.author.id;
    let xpToGive;

    function calculateNextLevelExp(lvl) {
      return Math.round((lvl / 0.12) * (lvl / 0.12));
    }

    if (member.content.length >= 50) {
      xpToGive = 5;
    } else if (member.content.length >= 25) {
      xpToGive = 3;
    } else if (member.content.length >= 10) {
      xpToGive = 1;
    } else {
      xpToGive = 0;
    }

    db.get(
      `SELECT * FROM '${guildId}' WHERE userid = ?`,
      [memberId],
      (err, row) => {
        if (!row) {
          db.prepare(`INSERT INTO '${guildId}' VALUES(?,?,?,?)`)
            .run(memberId, 0, 1, calculateNextLevelExp(1))
            .finalize();
        } else {
          db.run(`UPDATE '${guildId}' SET xp = xp + ? WHERE userid = ?`, [
            xpToGive,
            memberId,
          ]);
        }
      }
    );

    db.get(
      `SELECT * FROM '${guildId}' WHERE userid = ?`,
      [memberId],
      (err, row) => {
        if (!row) return;
        if (row.xp >= row.tonextlevel) {
          db.run(
            `UPDATE '${guildId}' SET xp = 0, level = level + 1, tonextlevel = ? WHERE userid = ?`,
            [calculateNextLevelExp(row.level + 1), memberId]
          );
          member.channel.send(
            `<@${memberId}>, you level upped level to lvl ${
              row.level + 1
            }! Congratulations!`
          );
        }
      }
    );
  },
};
