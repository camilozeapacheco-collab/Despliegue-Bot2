require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("despliegue")
    .setDescription("Crea un despliegue con votos")
    .addIntegerOption(opt =>
      opt.setName("minimos").setDescription("Mínimo de votos").setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("firma").setDescription("Firma del despliegue").setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registrando comandos...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("Comando /despliegue registrado correctamente.");
  } catch (e) {
    console.error(e);
  }
})();
