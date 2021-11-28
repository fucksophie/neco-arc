import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';

const ping = new Command(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
);

ping.on("interaction", async interaction => {
    await interaction.reply({ embeds: [ EmbedEngine.success(`websocket ping currently at: ${interaction.client.ws.ping}ms.`) ] });
});

export default ping;