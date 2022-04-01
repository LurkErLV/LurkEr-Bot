const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const db = require("../db/database");

function registerUser(guildId, memberId) {
  db.prepare(`INSERT INTO '${guildId}' VALUES(?,?,?,?)`)
              .run(memberId, 0, 1, calculateNextLevelExp(1))
              .finalize();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display users profile!"),
  async execute(interaction) {
    const guild = interaction.member.guild.id;

    db.get(
      `SELECT * FROM '${guild}' WHERE userid = ?`,
      [interaction.member.guild.ownerId],
      async (err, row) => {
        if (!row) {
          registerUser(guild, interaction.member.guild.ownerId);
        }
        
        let xp = row.xp;
        let level = row.level;
        let toNextLevel = row.tonextlevel;

        function progressBar(exp, nextLevelExp) {
          let result = (exp / nextLevelExp) * 450;
          if (result < 38) {
            result += 38;
          }
          return result;
        }

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");

        context.fillStyle = "#081c15";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Progress bar
        context.strokeStyle = "#40916c";
        context.fillStyle = "#40916c";
        roundRect(context, 225, 175, progressBar(xp, toNextLevel), 50, 25, true);

        context.strokeStyle = "#2D6A4F";
        context.lineWidth = 5;
        roundRect(context, 225, 175, 450, 50, 25, false);

        context.strokeStyle = "#1b4332";
        context.lineWidth = 20;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = applyText(canvas, `${xp}/${toNextLevel}`);
        context.fillStyle = "#40916c";
        context.fillText(`${xp}/${toNextLevel}`, 365, 160);

        context.font = applyText(canvas, interaction.member.displayName);
        context.fillStyle = "#40916c";
        context.fillText(interaction.member.displayName, 245, 75);

        context.beginPath();
        context.font = applyText(canvas, `LVL ${level}`);
        context.fillStyle = "#40916c";
        context.fillText(`LVL ${level}`, 500, 75);
        context.closePath();

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(
          interaction.user.displayAvatarURL({ format: "jpg" })
        );

        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          "profile-image.png"
        );

        interaction.reply({ files: [attachment] });
      }
    )
  },
};

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");

  let fontSize = 50;

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

    function calculateNextLevelExp(lvl) {
      return Math.round((lvl / 0.12) * (lvl / 0.12));
    }
