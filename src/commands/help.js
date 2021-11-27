import  { SlashCommandBuilder } from '@discordjs/builders';
import Command from '../utils/Command.js';
import {readdirSync} from "fs";
import EmbedEngine from '../utils/EmbedEngine.js';

const help = new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Recieve help!')
);

const commands = [];

readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(async A => {
	commands.push((await import(`./${A}`)).default);
});

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