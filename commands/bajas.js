const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bajas")
    .setDescription("Reporta la baja de una persona con fotos adjuntas.")
    .addStringOption(opt =>
      opt.setName("nombre")
        .setDescription("Nombre de la persona reportada")
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName("cedula")
        .setDescription("Foto de la cédula de la persona")
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName("muerto")
        .setDescription("Foto del cuerpo / muerto")
        .setRequired(true)
    ),

  async execute(interaction) {
    const nombre = interaction.options.getString("nombre");
    const cedula = interaction.options.getAttachment("cedula");
    const muerto = interaction.options.getAttachment("muerto");

    const embed = new EmbedBuilder()
      .setTitle("📉 **REPORTE DE BAJA**")
      .setColor("#8A0000")
      .setDescription(
        `#  **Nombre:** ${nombre}\n\n` +
        `El presente informe registra la baja correspondiente junto con la evidencia fotográfica aportada.`
      )
      .setImage(muerto.url)
      .addFields(
        { name: " Foto de cédula", value: "\u200B" },
      )
      .setThumbnail(cedula.url)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
