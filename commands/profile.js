const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const db = require("../db/database");

const colors = {
  background: "#485696",
  backgroundStroke: "#FC7A1E",
  progressBar: "#F9C784",
  progressBarStroke: "#FC7A1E",
  textColor: "#E7E7E7"
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display users profile!"),
  async execute(interaction) {
    const guild = interaction.member.guild.id;

    db.get(
      `SELECT * FROM '${guild}' WHERE userid = ?`,
      [interaction.user.id],
      async (err, row) => {
        if (!row) {
          return console.error("User isn't registred!");
        }

        let xp = row.xp;
        let lvl = row.level;
        let toLvlUp = row.tonextlevel;

        function progressBar(exp, nextLevelExp) {
          let result = (exp / nextLevelExp) * 650;
          if (result < 30) {
            result += 30;
          }
          return result;
        }

        const canvas = Canvas.createCanvas(700, 550);
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
          ctx.fillStyle = colors.background; // Background color
          ctx.fillRect(0, 0, 700, 550);

          ctx.strokeStyle = colors.backgroundStroke; // Background stroke color
          ctx.lineWidth = 15; // Stroke line width
          ctx.strokeRect(0, 0, 700, 550);
        ctx.closePath();

        ctx.beginPath();
          ctx.font = applyText(canvas, interaction.member.displayName);
          ctx.fillStyle = colors.textColor; // Member text color
          ctx.fillText(interaction.member.displayName, 245, 75);
        ctx.closePath();

        ctx.beginPath();
          ctx.fillStyle = colors.progressBar; // Progress bar color
          roundRect(ctx, 25, 285, progressBar(xp, toLvlUp), 50, 25, true, false);
        ctx.closePath();

        ctx.beginPath();
          ctx.strokeStyle = colors.progressBarStroke; // Progress bar stroke color
          ctx.lineWidth = 8;
          roundRect(ctx, 25, 285, 650, 50, 25, false);
        ctx.closePath();

        ctx.beginPath();
          ctx.font = applyText(canvas, `${xp}/${toLvlUp}`);
          ctx.fillStyle = colors.textColor; // XP color
          ctx.fillText(`${xp}/${toLvlUp}`, 25, 400);
        ctx.closePath();

        ctx.beginPath();
          ctx.font = applyText(canvas, `LVL ${lvl}`);
          ctx.fillStyle = colors.textColor; // LVL color
          ctx.fillText(`LVL ${lvl}`, 25, 530);
        ctx.closePath();

        ctx.beginPath(); // Make avatar circle
          ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          const avatar = await Canvas.loadImage(
            interaction.user.displayAvatarURL({ format: "jpg" })
          ); 

          ctx.drawImage(avatar, 25, 25, 200, 200); // Avatar
        ctx.closePath();

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          "profile-image.png"
        );

        interaction.reply({ files: [attachment] });
      }
    );
  },
};

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");

  let fontSize = 50;

  do {
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);

  return ctx.font;
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
