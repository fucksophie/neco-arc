import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import Command from '../types/Command.js';

const markov = new Command(
    new SlashCommandBuilder()
        .setName('markov')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start generation of a markov chain!'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop generation of a markov chain and trash it.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('generate')
                .setDescription('Create a markov chain from collected data!'))
        .setDescription("Create a Markov Chain!")
);


markov.on("interaction", async (interaction: CommandInteraction<CacheType>) => {

});

export default markov;