const { Events, Collection } = require("discord.js");
const user = require("../../database/Schemas/User");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    // ========== Registrando o usuario caso ele nao exista no banco de dados
    let userData;
    try {
      userData = await user.findOne({ idU: interaction.user.id });
      if (!userData) {
        userData = await user.create({
          idU: interaction.user.id,
          idS: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(`[DATABASE] Houve um erro ao tentar obter um user: ${err}`);
    }

    // ================================

    const command = interaction.client.commands.get(interaction.commandName);

    // ============ Sistema de Cooldown
    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return interaction.reply({
          content: `Por favor espere <t:${expiredTimestamp}:R> para utilizar o comando ${command.data.name} novamente.`,
          ephemeral: true,
        });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    // =============================================
    
    if (!command) {
      console.error(
        `O Comando: ${interaction.commandName} não foi encontrado..`,
      );
      return;
    }

    try {
      await command.execute(interaction, userData);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Ocorreu um erro ao executar este comando...",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Ocorreu um erro ao executar este comando...",
          ephemeral: true,
        });
      }
    }
  },
};