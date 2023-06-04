const fs = require("fs");
const { Events } = require("discord.js");

const db = require("croxydb");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  
  async execute(client, config, interaction) {
    const { user, channel, guild } = interaction;
    
    if(interaction.isChatInputCommand()) {
		if (!interaction.guild) return;
//larex
	for(let props of fs.readdirSync("./src/commands")) {
			const command = require(`../commands/${props}`);

			if(interaction.commandName.toLowerCase() === command.name.toLowerCase()) {

        		return command.execute(client, interaction, config, db);

        }
		  }	
	  }
  }
  }