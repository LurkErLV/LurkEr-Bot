const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping!"),
    async execute(interation) {
        interation.reply({
            content: "Pong!",
            ephemeral: true
        });
    }
}

