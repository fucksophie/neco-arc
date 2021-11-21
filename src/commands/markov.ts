import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import Command from '../types/Command.js';
import Markov from "js-markov";
import { markov as markovDb } from "../databases.js";

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
    if(interaction.options.getSubcommand() === "start") {
        if(await markovDb.has(interaction.channelId)) {
            await interaction.reply("A Markov Chain is already running!");
            return;
        }

        await markovDb.set(interaction.channelId, []);

        await interaction.reply("Markov Chain started!");
    } else if(interaction.options.getSubcommand() === "stop") {
        if(!await markovDb.has(interaction.channelId)) {
            await interaction.reply("There is no Markov Chain running!");
            return;
        }

        await markovDb.delete(interaction.channelId);

        await interaction.reply("Markov Chain stopped!");
    } else if(interaction.options.getSubcommand() === "generate") {
        if(!await markovDb.has(interaction.channelId)) {
            await interaction.reply("There is no Markov Chain running!");
            return;
        }

        const messages = await markovDb.get(interaction.channelId);

        if(messages.length < 3) {
            await interaction.reply("Not enough messages to generate a message!");
            return;
        }
        await interaction.reply("Training chain..");

        const startTime = Date.now();
        const chain = new Markov();
        chain.addStates(messages);

        chain.train();

        chain.generateRandom();

        await interaction.editReply(`
Message amount: \`${messages.length}\`
Took: \`${Date.now()-startTime}ms\` to train the Chain.
Message: \`${chain.generateRandom()}\``);
    }
});

export default markov;