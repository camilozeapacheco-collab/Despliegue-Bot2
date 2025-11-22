const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("desplegado")
        .setDescription("Envía un aviso anunciando que se alcanzaron los votos."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#00D67A")
            .setTitle("📢💥  **DESPLIEGUE CONFIRMADO**  💥📢")
            .setDescription(
                `#  **Objetivo cumplido**\n\n` +
                `## Hemos alcanzado **todos los votos necesarios**.\n` +
                `## El despliegue queda oficialmente **aprobado y activo**.\n\n` +
                `---\n` +
                `# 📻 **todos a RADIO 1**\n` +
                `### Mantengan comunicación, orden y coordinación.\n` +
                `---`
            )
            .setFooter({ text: "Mensaje automático del sistema de despliegues" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
