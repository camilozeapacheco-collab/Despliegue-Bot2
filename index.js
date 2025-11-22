const fs = require("fs");
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

// CLIENTE
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Colección de comandos
client.commands = new Collection();

// Advertencias por usuario
let advertencias = {};

// Cargar comandos
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ⛔ Palabras prohibidas
const prohibidas = ["porn", "porno", "vagina", "pene", "verga", "chocho", "culo", "teta"];

// 📌 Listener general de interacciones
client.on("interactionCreate", async interaction => {

  // Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) return command.execute(interaction);
  }

  // Botones
  if (interaction.isButton()) {

    // Botón de votación del /despliegue
    if (interaction.customId.startsWith("votar_")) {
      const command = client.commands.get("despliegue");
      if (command && command.button) return command.button(interaction);
    }

    // Botón para ver advertencias privadas
    if (interaction.customId.startsWith("advertencia_")) {
      const numero = interaction.customId.split("_")[1];

      return interaction.reply({
        content: `⚠️ **Advertencia ${numero}/3**\nEvita usar ese tipo de palabras.`,
        ephemeral: true
      });
    }
  }
});

// 📌 Sistema de palabras prohibidas
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const texto = message.content.toLowerCase();

  if (!prohibidas.some(p => texto.includes(p))) return;

  // Borrar mensaje
  try { await message.delete(); } catch {}

  const id = message.author.id;

  if (!advertencias[id]) advertencias[id] = 0;
  advertencias[id]++;

  // Botón que solo sirve para el usuario
  const boton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`advertencia_${advertencias[id]}`)
      .setLabel("Ver advertencia")
      .setStyle(ButtonStyle.Danger)
  );

  // Mensaje que todos ven, pero la advertencia solo la puede abrir él
  await message.channel.send({
    content: `<@${id}> tu mensaje contenía palabras prohibidas.`,
    components: [boton]
  });

  // Si llega a 3 advertencias → sanción simulada
  if (advertencias[id] >= 3) {
    await message.channel.send(
      `🚫 <@${id}> ha sido **sancionado** por exceder el límite de advertencias. *(sanción simulada)*`
    );

    advertencias[id] = 0;
  }
});

client.once("ready", () => {
  console.log(`Bot iniciado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
