const db = require("../db/database");
const {SlashCommandBuilder} = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setleavechannel")
        .setDescription("Set leave channel.")
        .addChannelOption(option => option
            .setName("leave")
            .setDescription("The channel to set as the leave channel")
            .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            return interaction.reply("You do not have permission to use this command!");
        }
        if (interaction.options.getChannel("leave").type !== "GUILD_TEXT") {
            return interaction.reply("Choose a text channel!");
        }

        db.get(`SELECT * FROM variables WHERE server_id = ?`, [interaction.guild.id], (err, row) => {
            if (err) {
                return console.error(err);
            }
            if (row === undefined) {
                db.run(`INSERT INTO variables VALUES(?,?)`, [interaction.guild.id, null]);
            }

            db.run(`UPDATE variables SET leave_channel_id = ? WHERE server_id = ?`, [interaction.options.getChannel("leave").id, interaction.guild.id]);
            return interaction.reply(`Leave channel has been set to ${interaction.options.getChannel("leave")}`);
        })
    }
}