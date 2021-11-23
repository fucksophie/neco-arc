import  { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
import Command from '../types/Command.js';
import EmbedEngine from '../types/EmbedEngine.js';

const ping = new Command(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
);

ping.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
    await interaction.reply({ embeds: [ EmbedEngine.success(`websocket ping currently at: ${interaction.client.ws.ping}ms.`) ] });
});

export default ping;