import  { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../types/Command.js';
import data from "../../data.js";

const ping = new Command(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
);

ping.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
    const embed = new MessageEmbed()
        .setTitle(ping.slash.name + " - response")
        .setDescription(`websocket ping currently at: ${interaction.client.ws.ping}ms.`)
        .setColor(data.color as ColorResolvable)
        .setFooter(interaction.client.user.username)
        .setTimestamp();

    await interaction.reply({ embeds: [ embed ] });
});

export default ping;