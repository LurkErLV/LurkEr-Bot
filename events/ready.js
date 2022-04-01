const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
require("dotenv").config();
const db = require('../db/database');

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log("Bot is online.");
        client.user.setActivity('Developing myself!', {type: "PLAYING"});
        client.user.setPresence({status: 'dnd'});

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: "9",
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(
                        Routes.applicationCommands(CLIENT_ID),
                        { body: commands },
                    );
                    console.log("Successfully registered commands globally.");
                } else {
                    await rest.put(
                        Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
                        {
                            body: commands,
                        }
                    );
                    console.log("Successfully registered commands locally.");
                }
            } catch (err) {
                if (err) console.error(err);
            }
        })();

        const guilds = client.guilds.cache.map(guild => guild.id);

        db.run(`CREATE TABLE IF NOT EXISTS variables
                (
                    server_id          INTEGER NOT NULL,
                    welcome_channel_id INTEGER,
                    leave_channel_id   INTEGER
                )`
        );

        for (const guild of guilds) {
            db.run(`CREATE TABLE IF NOT EXISTS "${guild}"
                    (
                        userid      INTEGER NOT NULL,
                        xp          INTEGER NOT NULL,
                        level       INTEGER NOT NULL,
                        tonextlevel INTEGER NOT NULL
                    )`
            );

            db.get(`SELECT *
                    FROM variables
                    WHERE server_id = ?`, [guild], (err, row) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!row) {
                    db.run(`INSERT INTO variables
                            VALUES (?, ?, ?)`, [guild, null, null]);
                }
            });
        }
        console.log('Database is ready!');
    }
};