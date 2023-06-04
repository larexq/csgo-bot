module.exports = {
  name: "ping",
  description: "Botunuzun pingini gösterir.",
  options: [],
  
  async execute(client, interaction) {
    
    await interaction.deferReply();
    
    return interaction.followUp({ content: `**${client.ws.ping}** ms` })
  }
}