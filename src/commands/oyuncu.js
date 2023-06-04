const gamedig = require("gamedig");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "oyuncu",
  description: "Sunucudaki belirttiğiniz kullanıcının bilgilerini görürsünüz.",
  options: [
        {
          type: 3,
          name: "oyuncu",
          description: "Oyuncunun ismini girin.",
          required: true
        }
    ],
  
  
  async execute(client, interaction, config) {
    
    await interaction.deferReply();
    
    const { user, options, guild } = interaction;
    
    const server = config.server;
    
    const csgo = await gamedig.query({
      type: "csgo",
      host: server.ip,
      port: server.port,
    });
    
    const player = csgo.players.find(player => player.name === options.getString("oyuncu"));
   
    const embed = new EmbedBuilder()
    .setAuthor({ name: `Kullanıcı Yok`, iconURL: guild.iconURL() })
    .setDescription(`Belirttiğin kullanıcı bulunamadı.`)

    if(!player) {
       return interaction.followUp({ embeds: [embed]});
    }
       
     const embed2 = new EmbedBuilder()
      .setAuthor({ name: player.name + " | Oyuncu Bilgileri", iconURL: guild.iconURL() })
      .setDescription(`> Score: **${player.raw.score}**\n> Time: **${player.raw.time}**`)
     
     return interaction.followUp({ embeds: [embed2] })
  }
}