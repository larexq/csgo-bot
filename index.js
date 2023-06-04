const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const chalk = require("chalk");

const client = new Client({
  intents: 32769,
  partials: Object.values(Partials),
  allowedMentions: {
    parse: ["users", "roles", "everyone"]
  },
  retyLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

for(let commandName of fs.readdirSync("./src/commands")) {
	if(!commandName.endsWith(".js")) break;

	const command = require(`./src/commands/${commandName}`);	
	client.commands.push({
		name: command.name.toLowerCase(),
		description: command.description,
		options: command.options,
		dm_permission: false,
		type: 1
	});

	console.log(chalk.red(`[COMMAND]`) + ` ${commandName} komut yüklendi`)
}

for(let eventName of fs.readdirSync("./src/events")) {
	if(!eventName.endsWith(".js")) break;

	const event = require(`./src/events/${eventName}`);	
  
  if(event.once) {
     client.once(event.name, (...args) => {
		  event.execute(client, config, ...args)
	  }); 
  } else {
    client.on(event.name, (...args) => {
		  event.execute(client, config, ...args)
	  }); 
  }

	console.log(chalk.blue(`[EVENT]`) + ` ${eventName} eventi yüklendi`)
}

client.once("ready", async() => {
	const rest = new REST({ version: "10" }).setToken(config.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    throw error;
  }
});

client.login(config.token)