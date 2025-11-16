const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

// Guardamos despliegues activos
const despliegues = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("despliegue")
    .setDescription("Crea un despliegue con votos")
    .addIntegerOption(opt =>
      opt.setName("minimos")
        .setDescription("Cantidad mínima de votos")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("firma")
        .setDescription("Nombre o firma del responsable")
        .setRequired(true)
    ),

  async execute(interaction) {
    const minimos = interaction.options.getInteger("minimos");
    const firma = interaction.options.getString("firma");

    const embed = new EmbedBuilder()
      .setColor("#005CFF")
      .setTitle("📣 DESPLIEGUE ABIERTO")
      .setDescription(
        `## Información del despliegue\n` +
        `**Firma:** ${firma}\n` +
        `**Votos necesarios:** ${minimos}\n\n` +

        `---\n` +

        `## Estado actual\n` +
        `**Votos registrados:** 0/${minimos}\n\n` +

        `---\n` +

        `## Lista de votantes\n` +
        `Nadie ha votado todavía.\n\n` +

        `---\n` +
        `Presiona el botón para votar.`
      );

    const botones = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`votar_${interaction.id}`)
        .setLabel("Votar")
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components: [botones],
      fetchReply: true
    });

    despliegues[interaction.id] = {
      votos: 0,
      minimos,
      votantes: [],
      firma,
      msg
    };
  },

  async button(interaction) {
    const id = interaction.customId.split("votar_")[1];
    const despliegue = despliegues[id];

    if (!despliegue) {
      return interaction.reply({
        content: "Este despliegue ya no está disponible.",
        ephemeral: true
      });
    }

    const usuario = interaction.user;

    // Evitar votos repetidos
    if (despliegue.votantes.includes(usuario.id)) {
      return interaction.reply({
        content: "Ya votaste en este despliegue.",
        ephemeral: true
      });
    }

    // Registrar voto
    despliegue.votantes.push(usuario.id);
    despliegue.votos++;

    // Construir lista visible
    const lista = despliegue.votantes
      .map(id => `• <@${id}>`)
      .join("\n");

    const nuevo = new EmbedBuilder()
      .setColor("#005CFF")
      .setTitle("📣 DESPLIEGUE ACTUALIZADO")
      .setDescription(
        `## Información del despliegue\n` +
        `**Firma:** ${despliegue.firma}\n` +
        `**Votos necesarios:** ${despliegue.minimos}\n\n` +

        `---\n` +

        `## Estado actual\n` +
        `**Votos registrados:** ${despliegue.votos}/${despliegue.minimos}\n\n` +

        `---\n` +

        `## Lista de votantes\n` +
        `${lista}\n\n` +

        `---\n` +
        `Presiona el botón para votar.`
      );

    await despliegue.msg.edit({ embeds: [nuevo] });

    return interaction.reply({
      content: "Tu voto fue registrado.",
      ephemeral: true
    });
  }
};
