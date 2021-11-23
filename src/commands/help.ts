import  { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import Command from '../types/Command.js';
import {readdirSync} from "fs";
import EmbedEngine from '../types/EmbedEngine.js';

const help = new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Recieve help!')
);

const commands: Array<Command> = [];

readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(async A => {
	commands.push((await import(`./${A}`)).default);
});

help.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
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