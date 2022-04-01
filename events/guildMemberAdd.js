const db = require("../db/database");
const Discord = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    async execute(newMember) {
        const guildId = newMember.guild.id;
        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#4287f5")
            .setTitle("New member!")
            .setDescription(`${newMember.user} has joined the server!`)
            .setThumbnail(newMember.user.displayAvatarURL())
            .setTimestamp();
        db.get(`SELECT *
                FROM variables
                WHERE server_id = ?`, [guildId], (err, row) => {
            if (!row.welcome_channel_id) return;
            const welcomeChannelId = row.welcome_channel_id;
            newMember.guild.channels.cache.find(channel => parseInt(channel.id) === welcomeChannelId)
                .send({
                    embeds: [newMemberEmbed]
                });
        });
    }
}