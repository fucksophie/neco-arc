import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';

const stats = new Command(
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View statistics from a lot of different places!')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Statistic location')
                .setRequired(true)
                .addChoices([
                    ["Growtopia", "growtopia"],
                    ["Kawaii.red (reactions)", "kawaiired"]
                ]))
);

stats.on("interaction", async interaction => {
    await interaction.reply({ embeds: [ EmbedEngine.error("Not implemented.") ] });
});

export default stats;