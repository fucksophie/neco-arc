import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';
import commands from "../utils/data.js"

const help = new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Recieve help!')
);


help.on("interaction", async interaction => {
    await interaction.reply({ embeds: [ EmbedEngine.success("Available commands!")
        .addFields(commands.map(e => {
            return {
                name: e.slash.name,
                value: e.slash.description,
                inline: true
            }
        })) 
    ] });
});

export default help;
