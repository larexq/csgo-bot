const gamedig = require("gamedig");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "oynayanlar",
  description: "Sunucuda oynayanların isimlerini gösterir.",
  options: [],
  
  async execute(client, interaction, config) {
    await interaction.deferReply();
    
    const { user, options, guild } = interaction;
    const server = config.server;
    const players = [];
    
    const csgo = await gamedig.query({
      type: "csgo",
      host: server.ip,
      port: server.port,
    });
    
    for (const i in csgo.players) {
      const timeInSeconds = Math.floor(csgo.players[i].raw.time);
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      players.push(`👥 | ${csgo.players[i].name} **|** Süre: \`${formattedTime}\` **|** Skor: \`${csgo.players[i].raw.score || "Bulunamadı"}\``);
    }
    
    const max = 25;
    let min = 0;
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: csgo.name, iconURL: guild.iconURL() })
      .setDescription(players.slice(min, max).join("\n"));
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('geri')
          .setEmoji('⬅️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('sayfa')
          .setLabel(`${min + 1}-${Math.min(max, csgo.raw.numplayers)}`)
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ileri')
          .setEmoji('➡️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );
    
    await interaction.followUp({ embeds: [embed], components: [row] });
    
    const filter = i => i.user.id === user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter });
    
    collector.on('collect', async i => {
      if (i.customId === "ileri") {
        min += 25;
        const newMin = Math.min(min, csgo.raw.numplayers - 1);
        const newMax = Math.min(min + 25, csgo.raw.numplayers);
        embed.setDescription(players.slice(newMin, newMax).join("\n"));
        row.getComponents()[1].setLabel(`${newMin + 1}-${newMax}`);
        row.getComponents()[0].setDisabled(false);
        row.getComponents()[2].setDisabled(false);
        i.update({ embeds: [embed], components: [row] });
      } else if (i.customId === "geri") {
        min -= 25;
        const newMin = Math.max(min, 0);
        const newMax = newMin + 25;
        embed.setDescription(players.slice(newMin, newMax).join("\n"));
        row.getComponents()[1].setLabel(`${newMin + 1}-${newMax}`);
        row.getComponents()[0].setDisabled(false);
        row.getComponents()[2].setDisabled(false);
        i.update({ embeds: [embed], components: [row] });
      }
    });
  }
};