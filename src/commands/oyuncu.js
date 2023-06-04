const gamedig = require("gamedig");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "oyuncu",
  description: "Sunucudaki belirtilen kullanıcının bilgilerini görüntüler.",
  options: [
    {
      type: 3,
      name: "oyuncu",
      description: "Oyuncunun adını girin.",
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
    
    const playerName = options.getString("oyuncu");
    const player = csgo.players.find(player => player.name === playerName);
   
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Kullanıcı Bulunamadı`, iconURL: guild.iconURL() })
        .setDescription(`Belirttiğiniz kullanıcı sunucuda bulunamadı.`);
        
      return interaction.followUp({ embeds: [embed] });
    }
       
    let time = "Bulunamadı";
    if (player.raw.time) {
      const minutes = Math.floor(player.raw.time / 60);
      const seconds = player.raw.time % 60;
      time = `${minutes}:${seconds.toFixed(2)}`;
    }
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${player.name} | Oyuncu Bilgileri`, iconURL: guild.iconURL() })
      .setDescription(`**Score:** ${player.raw.score || "Bulunamadı"}\n**Time:** ${time}`);
     
    return interaction.followUp({ embeds: [embed] });
  }
}
