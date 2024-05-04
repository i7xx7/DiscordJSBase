const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client){
		console.log(`[BOT] Login realizado com exitô em: ${client.user.tag}`);
	}
};