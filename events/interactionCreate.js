const db = require("../db/database");

function registerUser(guildId, memberId) {
  db.prepare(`INSERT INTO '${guildId}' VALUES(?,?,?,?)`)
    .run(memberId, 0, 1, calculateNextLevelExp(1))
    .finalize();
}

function calculateNextLevelExp(lvl) {
  return Math.round((lvl / 0.12) * (lvl / 0.12));
}

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const guild = interaction.member.guild.id;
    const memberId = interaction.user.id;

    db.get(
      `SELECT * FROM '${guild}' WHERE userid = ?`,
      [interaction.user.id],
      async (err, row) => {
        if (!row) {
          registerUser(guild, memberId);
          setTimeout(async () => {
            if (!interaction.isCommand()) return;

            const command = interaction.client.commands.get(
              interaction.commandName
            );

            if (!command) return;

            try {
              await command.execute(interaction);
            } catch (err) {
              if (err) console.error(err);

              await interaction.reply({
                content: "An error ocurred while executing that command.",
                ephemeral: true,
              });
            }
          }, 100);
        } else {
          if (!interaction.isCommand()) return;

          const command = interaction.client.commands.get(
            interaction.commandName
          );

          if (!command) return;

          try {
            await command.execute(interaction);
          } catch (err) {
            if (err) console.error(err);

            await interaction.reply({
              content: "An error ocurred while executing that command.",
              ephemeral: true,
            });
          }
        }
      }
    );
  },
};
