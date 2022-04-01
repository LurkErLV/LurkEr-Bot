const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get info about a user or a server!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("user")
                .setDescription("Get info about a user!")
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName("server")
                .setDescription("Get info about a server!")),
    async execute(interaction) {

        if (interaction.commandName === 'info') {
            if (interaction.options.getSubcommand() === 'user') {
                const target = interaction.options.getUser('target');

                if (target) {
                    const embed = {
                        color: 0x4287f5,
                        title: `${target.bot ? "Bot:" : "User:"}`,
                        author: {
                            name: `${interaction.user.username}`,
                            icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
                        },
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Username:',
                                value: `${target.username}`
                            },
                            {
                                name: 'ID:',
                                value: `${target.id}`
                            }
                        ],
                        image: {
                            url: `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}`
                        }
                    };
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });
                } else {
                    const embed = {
                        color: 0x4287f5,
                        title: `${interaction.user.bot ? "Bot:" : "User:"}`,
                        author: {
                            name: `${interaction.user.username}`,
                            icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
                        },
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Your Username:',
                                value: `${interaction.user.username}`
                            },
                            {
                                name: 'Your ID:',
                                value: `${interaction.user.id}`
                            }
                        ],
                        image: {
                            url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
                        }
                    };
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });
                }
            } else if (interaction.options.getSubcommand() === 'server') {
                const embed = {
                    color: 0x4287f5,
                    title: `Server:`,
                    author: {
                        name: `${interaction.user.username}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Server name:',
                            value: `${interaction.guild.name}`
                        },
                        {
                            name: 'Total members:',
                            value: `${interaction.guild.memberCount}`
                        }
                    ]
                };
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        }
    }
}