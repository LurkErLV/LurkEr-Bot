const db = require("../db/database");
const Discord = require('discord.js');

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        const guildId = member.guild.id;
        const leaveMemberEmbed = new Discord.MessageEmbed()
            .setColor("#4287f5")
            .setTitle("Bye!")
            .setDescription(`${member.user} has leaved the server!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
        db.get(`SELECT *
                FROM variables
                WHERE server_id = ?`, [guildId], (err, row) => {
            if (!row.leave_channel_id) return;
            const leaveChannelId = row.leave_channel_id;
            member.guild.channels.cache.find(channel => parseInt(channel.id) === leaveChannelId)
                .send({
                    embeds: [leaveMemberEmbed]
                });
        });
    }
}