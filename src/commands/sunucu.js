const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const gamedig = require("gamedig");
const request = require("request");

module.exports = {
  name: "sunucu",
  description: "Csgo sunucunuzun genel bilgilerini gösterir.",
  options: [],
  
  async execute(client, interaction, config) {
    
    await interaction.deferReply();
    
    const { user, options, guild } = interaction;
   
    const server = config.server;
    
    const csgo = await gamedig.query({
      type: "csgo",
      host: server.ip,
      port: server.port,
    });

    request(`http://api.gametracker.rs/demo/json/server_info/${server.ip}:${server.port}/`, function (error, response, body) {
    const json_body = JSON.parse(body);
    const top = json_body.rank;
    const durum = json_body.status;
    const apierror = json_body.apiError;

    if(apierror === 0) {

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel('GameTracker Link')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://www.gametracker.com/server_info/${server.ip}:${server.port}`)
      )

      const embed = new EmbedBuilder()
      .setAuthor({ name: `${csgo.name}`, iconURL: `${guild.iconURL()} ` })
      .setDescription(`\`\`\`fix\nIp Bilgileri\`\`\`\n> Ip: \`${csgo.connect}\`\n> Port: \`27015\`\n> Tıkla Bağlan: [${csgo.connect}](https://steam://connect/${csgo.connect})\n\n\`\`\`fix\n\nAktiflik Bilgileri\`\`\`\n> Oyuncu Sayısı: \`${csgo.raw.numplayers}/${csgo.maxplayers}\`\n> Map: \`${csgo.map}\`\n> Sunucu Aktifmi: \`${durum.toString().replace("1", "Evet").toString().replace("0", "Hayır")}\`\n\n\`\`\`fix\nGameTracker\`\`\`\nSıralama: \`${top || "Bulunamadı"}\``)
      .setTimestamp()
      .setFooter({ text: `${user.tag} tarafından istendi.`, iconURL: `${user.displayAvatarURL()} ` })
      
      interaction.followUp({ embeds: [embed], components: [row] })
      }

      if(apierror === 1) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${csgo.name}`, iconURL: `${guild.iconURL()} ` })
        .setDescription(`\`\`\`fix\nIp Bilgileri\`\`\`\n> Ip: \`${csgo.connect}\`\n> Port: \`27015\`\n> Tıkla Bağlan: [${csgo.connect}](https://steam://connect/${csgo.connect})\n\n\`\`\`fix\n\nAktiflik Bilgileri\`\`\`\n> Oyuncu Sayısı: \`${csgo.raw.numplayers}/${csgo.maxplayers}\`\n> Map: \`${csgo.map}\`\n> Sunucu Aktifmi: \`Bilinmiyor\`\n\n\`\`\`fix\nGameTracker\`\`\`\nSıralama: \`${top || "Bulunamadı"}\``)
        .setTimestamp()
        .setFooter({ text: `${user.tag} tarafından istendi.`, iconURL: `${user.displayAvatarURL()} ` })
        
        interaction.followUp({ embeds: [embed] })
        }
  })
  }
}