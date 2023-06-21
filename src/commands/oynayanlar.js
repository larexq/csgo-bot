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
    
    
    for(const i in csgo.players) {
      players.push(`\`👥\` **|** ${csgo.players[i].name} **|** Time: \`${csgo.players[i].raw.time || "Bulunamadı"}\` **|** Score: \`${csgo.players[i].raw.score || "Bulunamadı"}\``)

      const timeInSeconds = Math.floor(csgo.players[i].raw.time);
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      players.push(`\`👥\` **|** ${csgo.players[i].name} **|** Time: \`${formattedTime || "Bulunamadı"}\` **|** Score: \`${csgo.players[i].raw.score || "Bulunamadı"}\``)
    }
    
    var max = 25;
    var min = 0;
    
    if(max > csgo.raw.numplayers) {
    
    const embed = new EmbedBuilder()
    .setAuthor({ name: csgo.name, iconURL: guild.iconURL() })
    .setDescription(players.slice(min, max).join("\n"))

    const row = new ActionRowBuilder()
			.addComponents(
        new ButtonBuilder()
        .setCustomId('geri')
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('sayfa')
        .setLabel(`${min}/${csgo.raw.numplayers}`)
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('ileri')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
			);
    
    await interaction.followUp({ embeds: [embed], components: [row] });
      }

      if(max < csgo.raw.numplayers) {

        const embed = new EmbedBuilder()
        .setAuthor({ name: csgo.name, iconURL: guild.iconURL() })
        .setDescription(players.slice(min, max).join("\n"))
    
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('geri')
              .setEmoji('⬅️')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('sayfa')
              .setLabel(`${min}/${max}`)
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('ileri')
              .setEmoji('➡️')
              .setStyle(ButtonStyle.Primary),
          );
        
        await interaction.followUp({ embeds: [embed], components: [row] });
      }

    const filter = i =>  i.user.id === user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter });
    
    collector.on('collect', async i => {
	   if(i.customId === "ileri") {
         max += 25;
         min += 25;
    
       const arti = max
       const eksi = min
    
    const embed = new EmbedBuilder()
    .setAuthor({ name: csgo.name, iconURL: guild.iconURL() })
    .setDescription(players.slice(eksi, arti).join("\n"))
    
    if(arti > csgo.raw.numplayers) {
       const rowa = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('geri')
					.setEmoji('⬅️')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('sayfa')
					.setLabel(`${eksi}/${csgo.raw.numplayers}`)
          .setDisabled(true)
					.setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setDisabled(true)
					.setCustomId('ileri')
					.setEmoji('➡️')
					.setStyle(ButtonStyle.Primary),
        
			);
       return i.update({ embeds: [embed], components: [rowa] })
      } 
      
      else {
      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('geri')
					.setEmoji('⬅️')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('sayfa')
					.setLabel(`${eski}/${arti}`)
          .setDisabled(true)
					.setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
					.setCustomId('ileri')
					.setEmoji('➡️')
					.setStyle(ButtonStyle.Primary),
			);
      
     return i.update({ embeds: [embed], components: [row] })
    }
       
     }
      
      
      if(i.customId === "geri") {
         max -= 25;
         min -= 25;
    

       const arti = max
       const eski = min
       
    const a = players.slice(eski, arti)
    const v1 = a.join("\n")
    
    const embed = new EmbedBuilder()
    .setColor(config.color || 0x2F3136)
    .setAuthor({ name: `${csgo.name}`, iconURL: `${guild.iconURL()} ` })
    .setDescription(v1)
    .setTimestamp()
    .setFooter({ text: `${user.tag} tarafından istendi.`, iconURL: `${user.displayAvatarURL()} ` })
    
    if(arti === 25) {
       const rowa = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('geri')
        .setDisabled(true)
					.setEmoji('⬅️')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('sayfa')
					.setLabel(`${eski}/${arti}`)
          .setDisabled(true)
					.setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setDisabled(false)
					.setCustomId('ileri')
					.setEmoji('➡️')
					.setStyle(ButtonStyle.Primary),
        
			);
      
       return i.update({ embeds: [embed], components: [rowa] })
    } else {
      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('geri')
					.setEmoji('⬅️')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('sayfa')
					.setLabel(`${eski}/${arti}`)
          .setDisabled(true)
					.setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
					.setCustomId('ileri')
					.setEmoji('➡️')
					.setStyle(ButtonStyle.Primary),
			);
      
     return i.update({ embeds: [embed], components: [row] })
    }
       
     }
    });
    
  }
}

