const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "yardım",
  description: "Csgo botunun yardım menüsünü gösterir.",
  options: [],
  
  async execute(client, interaction, config) {
    
    await interaction.deferReply();
    
    const { user, options, guild } = interaction;

  const embed = new EmbedBuilder()
      .setAuthor({ name: `Csgo | Yardım Menüsü`, iconURL: guild.iconURL(), url: "https://discord.gg/dcbot" })
      .setDescription(`> \`/sunucu\`: Sunucu bilgilerinizi gösterir.
      > \`/oynayanlar\`: Sunucunuzdaki oynayan oyunculara bakarsınız.
      > \`/yardım\`: Bu yardım menüsünü açar.
      > \`/ping\`: Botun pingini gösterir.`)
     
     return interaction.followUp({ embeds: [embed] })
  }
}