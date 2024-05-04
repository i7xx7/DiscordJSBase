const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpe uma determinada quantidade de mensagens de um canal')
    .addNumberOption(option => option
        .setName('quantia')
        .setDescription('Quantia de mensagens que seram apagadas')
        .setRequired(true)),
    async execute(interaction){
        const amountMsg =  await interaction.options.getNumber('quantia')
        
        if(amountMsg > 50) {
            return await interaction.reply({ ephemeral: true, content: `Escolha entre \` 1 - 50 \` mensagens para serem apagadas. ` })
        }
        else {
            const amount = await interaction.channel.bulkDelete(amountMsg)
            await interaction.reply({ ephemeral: true, content: `Foram excluidas ${amount} mensagens` })
        }
    }
}