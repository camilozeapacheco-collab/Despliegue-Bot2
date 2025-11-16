const fs = require("fs");
require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) return command.execute(interaction);
  }

  if (interaction.isButton()) {
    if (interaction.customId.startsWith("votar_")) {
      const command = client.commands.get("despliegue");
      if (command && command.button) return command.button(interaction);
    }
  }
});

client.once("ready", () => {
  console.log(`Bot iniciado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
