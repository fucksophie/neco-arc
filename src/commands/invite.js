import  { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';

const ping = new Command(
    new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite the bot!')
);

ping.on("interaction", async interaction => {
    await interaction.reply({ embeds: [ EmbedEngine.success(`;) Invite the bot!`).setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=0&scope=applications.commands%20bot`) ] });
});

export default ping;