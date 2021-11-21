import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../types/Command.js';
import data from "../../data.js";

import {
    evaluate
} from 'mathjs'

const math = new Command(
    new SlashCommandBuilder()
        .setName('math')
        .addStringOption(option =>
            option.setName('evaluation')
                .setDescription('math to evaluate')
                .setRequired(true))
        .setDescription('do math')
);


math.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
    const evaluation = interaction.options.getString("evaluation", true);

    const embed = new MessageEmbed()
        .setTitle(math.slash.name + " - response")
        .setColor(data.color as ColorResolvable)
        .setFooter(interaction.client.user.username)
        .setTimestamp();

    try {
        const evaled = evaluate(evaluation);
        embed.setDescription(`${evaluation} = ${evaled}`)
    } catch {
        embed.setDescription(`Invalid math expression.`)
    }
    
    await interaction.reply({ embeds: [ embed ] });
});

export default math;