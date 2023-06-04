const { Events } = require("discord.js");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");
const gamedig = require("gamedig");

module.exports = {
  name: Events.ClientReady,
  once: true,
  
  async execute(client, config) {
    console.log(chalk.green(`[START]`) + ` ${client.user.tag} aktif`)
    
    const server = config.server;

    const csgo = await gamedig.query({
      type: "csgo",
      host: server.ip,
      port: server.port,
    });

    client.user.setPresence({
      activities: [{ name: `${csgo.raw.numplayers}/${csgo.maxplayers} kişi`, type: ActivityType.Playing }],
      status: 'idle', //idle, dnd, online
    });
    }
}