const { SlashCommandBuilder } = require("discord.js");

module.exports = (client, logger) => {
  return {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!"),
    async execute(interaction) {
      logger.info("Ping Slash");
      await interaction.reply(client.ws.ping.toString() + "ms");
    },
  };
};
