const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Veja a latencia atual do bot'),
    async execute(interaction, client){
        await interaction.reply({ content: `🏓 ${interaction.client.ws.ping}ms`, ephemeral: true })
    }
}