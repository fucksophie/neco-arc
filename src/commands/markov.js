import { SlashCommandBuilder } from '@discordjs/builders';
import Command from '../utils/Command.js';
import Markov from "js-markov";
import { markov as markovDb } from "../databases.js";
import EmbedEngine from '../utils/EmbedEngine.js';

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


markov.on("interaction", async interaction => {
    if(interaction.options.getSubcommand() === "start") {
        if(await markovDb.has(interaction.channelId)) {
            await interaction.reply({ embeds: [ EmbedEngine.error("A Markov Chain is already running!") ] });
            return;
        }

        await markovDb.set(interaction.channelId, []);

        await interaction.reply({ embeds: [ EmbedEngine.success("Markov Chain started!") ] });
    } else if(interaction.options.getSubcommand() === "stop") {
        if(!await markovDb.has(interaction.channelId)) {
            await interaction.reply({ embeds: [ EmbedEngine.error("There is no Markov Chain running!") ] });
            return;
        }

        await markovDb.delete(interaction.channelId);

        await interaction.reply({ embeds: [ EmbedEngine.success("Markov Chain stopped!") ] });
    } else if(interaction.options.getSubcommand() === "generate") {
        if(!await markovDb.has(interaction.channelId)) {
            await interaction.reply({ embeds: [ EmbedEngine.error("There is no Markov Chain running!") ] });
            return;
        }

        const messages = await markovDb.get(interaction.channelId);

        if(messages.length < 3) {
            await interaction.reply({ embeds: [ EmbedEngine.error("Not enough messages to generate a Markov Chain!") ] });
            return;
        }
        
        await interaction.reply({ embeds: [ EmbedEngine.loading("Training Markov Chain...") ] });

        const startTime = Date.now();
        const chain = new Markov();
        chain.addStates(messages);

        chain.train();

        chain.generateRandom();

        await interaction.editReply({ embeds: [ EmbedEngine.loading(`
Message amount: \`${messages.length}\`
Took: \`${Date.now()-startTime}ms\` to train the Chain.
Message: \`${chain.generateRandom()}\``) ] });
    }
});

export default markov;