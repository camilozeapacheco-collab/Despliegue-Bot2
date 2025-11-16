const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require("discord.js");

let votos = {};
let usuariosVotaron = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("despliegue")
    .setDescription("Crea un despliegue con votos grandes y llamativos")
    .addIntegerOption(opt =>
      opt.setName("minimos")
        .setDescription("Mínimo de votos necesarios")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("firma")
        .setDescription("Firma del despliegue")
        .setRequired(true)
    ),

  async execute(interaction) {
    const minimos = interaction.options.getInteger("minimos");
    const firma = interaction.options.getString("firma");

    const id = Date.now();
    votos[id] = 0;
    usuariosVotaron[id] = new Set();

    const embed = new EmbedBuilder()
      .setColor("#0066FF")
      .setTitle("📢 **DESPLIEGUE OFICIAL**")
      .setDescription(
        `# 🔥 **VOTOS NECESARIOS: ${minimos}**\n` +
        `# ✍️ **FIRMA: ${firma}**\n\n` +
        `## 🗳 **VOTOS ACTUALES:** \`${votos[id]}\`\n\n` +
        `---\n` +
        `### 👉 Presiona el botón para votar`
      );

    const boton = new ButtonBuilder()
      .setCustomId(`votar_${id}`)
      .setLabel("🔵 VOTAR AHORA")
      .setStyle(ButtonStyle.Primary);

    const fila = new ActionRowBuilder().addComponents(boton);

    await interaction.reply({
      embeds: [embed],
      components: [fila]
    });
  },

  async button(interaction) {
    const id = interaction.customId.split("_")[1];

    if (usuariosVotaron[id].has(interaction.user.id)) {
      return interaction.reply({
        content: "⚠ Ya votaste en este despliegue.",
        ephemeral: true
      });
    }

    usuariosVotaron[id].add(interaction.user.id);
    votos[id]++;

    const original = interaction.message.embeds[0];
    const lineas = original.data.description.split("\n");

    const minimos = lineas[0].replace(/[^0-9]/g, "");
    const firma = lineas[1].split("**")[2];

    const nuevo = new EmbedBuilder()
      .setColor("#0066FF")
      .setTitle("📢 **DESPLIEGUE OFICIAL**")
      .setDescription(
        `# 🔥 **VOTOS NECESARIOS: ${minimos}**\n` +
        `# ✍️ **FIRMA: ${firma}**\n\n` +
        `## 🗳 **VOTOS ACTUALES:** \`${votos[id]}\`\n\n` +
        `---\n` +
        `### 👉 Presiona el botón para votar`
      );

    await interaction.update({
      embeds: [nuevo],
      components: interaction.message.components
    });
  }
};
