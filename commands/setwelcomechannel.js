const db = require("../db/database");
const {SlashCommandBuilder} = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcomechannel")
        .setDescription("Set welcome channel.")
        .addChannelOption(option => option
            .setName("welcome")
            .setDescription("The channel to set as the welcome channel")
            .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            return interaction.reply("You do not have permission to use this command!");
        }
        if (interaction.options.getChannel("welcome").type !== "GUILD_TEXT") {
            return interaction.reply("Choose a text channel!");
        }

        db.get(`SELECT * FROM variables WHERE server_id = ?`, [interaction.guild.id], (err, row) => {
            if (err) {
                return console.error(err);
            }
            if (row === undefined) {
                db.run(`INSERT INTO variables VALUES(?,?)`, [interaction.guild.id, null]);
            }

            db.run(`UPDATE variables SET welcome_channel_id = ? WHERE server_id = ?`, [interaction.options.getChannel("welcome").id, interaction.guild.id]);
            return interaction.reply(`Welcome channel has been set to ${interaction.options.getChannel("welcome")}`);
        })
    }
}