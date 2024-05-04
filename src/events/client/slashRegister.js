const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const commands = [];
const foldersPath = path.join(__dirname, '../../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
            console.log(`[AVISO] O Comando ${filePath} esta sem uma propriedade "data" ou "execute"`);
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`[REGIS] Registrando ${commands.length} slash commands (/)`);

		const data = await rest.put(
            // Os Slash commands serão registrados globalmente, caso queira registar apenas em uma guild especifica basta trocar este codigo
            // abaixo por este: Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`[REGIS] Sucesso ao registrar ${data.length} slash commands (/).`);
	} catch (error) {
		console.error(error);
	}
})();