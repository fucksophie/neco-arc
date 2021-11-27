import { SlashCommandBuilder } from '@discordjs/builders';
import Command from '../utils/Command.js';

import {
    evaluate
} from 'mathjs'

import EmbedEngine from '../utils/EmbedEngine.js';

const math = new Command(
    new SlashCommandBuilder()
        .setName('math')
        .addStringOption(option =>
            option.setName('evaluation')
                .setDescription('math to evaluate')
                .setRequired(true))
        .setDescription('do math')
);


math.on("interaction", async interaction=> {
    const evaluation = interaction.options.getString("evaluation", true);

    let embed;

    try {
        const evaled = evaluate(evaluation);
        embed = EmbedEngine.success(`${evaluation} = ${evaled}`);
    } catch {
        embed = EmbedEngine.error(`Invalid math expression.`);
    }
    
    await interaction.reply({ embeds: [ embed ] });
});

export default math;