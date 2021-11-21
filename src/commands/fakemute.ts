import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ColorResolvable, CommandInteraction, Interaction, MessageEmbed, User } from 'discord.js';
import Command from '../types/Command.js';
import data from "../../data.js";

const math = new Command(
    new SlashCommandBuilder()
        .setName('fakemute')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to mute')
                .setRequired(true))
        .setDescription('Mute a user, bypassing all laws.')
);

math.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
    const user: User = interaction.options.getUser("user", true);
    const roleName = "neco-arc-fakemute"

    let role = interaction.guild.roles.cache.find(x => x.name === roleName);
    if (!role) {
        role = await interaction.guild.roles.create({
            name: roleName,
            hoist: true
        })
    }

    const guildUser = await interaction.guild.members.fetch(user);
    await guildUser.roles.add(role);
    const embed = new MessageEmbed()
        .setTitle(math.slash.name + " - response")
        .setDescription(`Fakemuted ${user.username}!`)
        .setColor(data.color as ColorResolvable)
        .setFooter(interaction.client.user.username)
        .setTimestamp();
    
    await interaction.reply({ embeds: [ embed ] });
});

export default math;