import  { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../types/Command.js';
import data from "../../data.js";
import {readdirSync} from "fs";

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
    const embed = new MessageEmbed()
        .setTitle(help.slash.name + " - response")
        .setColor(data.color as ColorResolvable)
        .setFooter(interaction.client.user.username)
        .addFields(commands.map(e => {
            return {
                name: e.slash.name,
                value: e.slash.description,
                inline: true
            }
        }))
        .setTimestamp();
    
    await interaction.reply({ embeds: [ embed ] });
});

export default help;