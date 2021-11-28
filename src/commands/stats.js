import p from "phin";
import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';

const stats = new Command(
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View statistics from a lot of different places!')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Statistic location')
                .setRequired(true)
                .addChoices([
                    ["Growtopia", "growtopia"],
                    ["Kawaii.red (reactions)", "kawaiired"]
                ]))
);

stats.on("interaction", async interaction => {
    const command = interaction.options.getString("location", true);
    if(command == "growtopia") {
        const res = await p({
            'url': `https://www.growtopiagame.com/detail`,
            'parse': 'json'
        })

        const embed = EmbedEngine.success("Growtopia Statistics");

        embed.setDescription(`Current World of the Day is ${res.body.world_day_images.full_size.replace(/(\.png)|.*\//gm, "")}!`)
        embed.setImage(res.body.world_day_images.full_size);
        embed.setFooter(`There are currently ${res.body.online_user} users online!`);
    
        await interaction.reply({ embeds: [ embed ] });
    } else {
        await interaction.reply({ embeds: [ EmbedEngine.error("Not implemented.") ] });
    }

});

export default stats;