import p from "phin";
import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';

import config from '../utils/Config.js';

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
    	await interaction.deferReply();
        const res = await p({
            'url': `https://www.growtopiagame.com/detail`,
            'parse': 'json'
        })

        const embed = EmbedEngine.success("Growtopia Statistics");

        embed.setDescription(`Current World of the Day is ${res.body.world_day_images.full_size.replace(/(\.png)|.*\//gm, "")}!`)
        embed.setImage(res.body.world_day_images.full_size);
        embed.setFooter(`There are currently ${res.body.online_user} users online!`);
    
        await interaction.editReply({ embeds: [ embed ] });
    } else if(command == "kawaiired") {
        await interaction.deferReply();

        const embed = EmbedEngine.success("Kawaii.red endpoint status");
        
        for await (const e of ["all", "most_endpoint"]) {
            const answer = await p({
                url: `https://kawaii.red/api/stats/${e}/token=${config.keys.kawaii}/`,
                parse: "json"
            })

            if(e == "all") {
                embed.addField("Amount of request sent", answer.body.response.toString(), true)
            } else if(e == "most_endpoint") {
                embed.addField("Most used endpoint", `${answer.body.response.name} - ${answer.body.response.value}`, true)
            }
        }

        await interaction.editReply({ embeds: [ embed ] });
    }

});

export default stats;