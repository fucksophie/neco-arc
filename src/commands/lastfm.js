import { SlashCommandBuilder } from '@discordjs/builders';
import p from "phin";

import { readFileSync } from 'fs';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';
import { lastfmData } from "../utils/data.js"
import { lastfm as lastDb } from "../utils/databases.js";

const config = JSON.parse(readFileSync("./config.json").toString());

const slashCommand =  new SlashCommandBuilder();

lastfmData.top.forEach(e => {
    slashCommand.addSubcommand(subcommand => 
        subcommand.setName(`top${e.name}s`)
            .setDescription(`View your top ${e.name}s!`)
            .addStringOption(option => 
                option
                    .setName("period")
                    .setDescription("Period of time to fetch tracks from")
                    .addChoices(lastfmData.periods.map(e => {
                        return [e.human, e.name]
                    })))
    )
})

const lastfm = new Command(
    slashCommand.setName('lastfm') // at this point the top-something subcommands are already added
    .setDescription("last.fm in Discord")
    .addSubcommand(subcommand => 
        subcommand.setName("link")
            .setDescription("Link your last.fm account with your discord account")
            .addStringOption(option => 
                option.setRequired(true)
                    .setName("name")
                    .setDescription("Your name on last.fm!")
            ))
    .addSubcommand(subcommand => 
        subcommand.setName("np")
            .setDescription("View your now-playing."))

);

lastfm.on("interaction", async interaction=> {
    const subcommand = interaction.options.getSubcommand();

    lastfmData.top.forEach(async e => {
        if(subcommand == `top${e.name}s`) {
            if(!(await lastDb.has(interaction.user.id))) {
                await interaction.reply({ embeds: [ EmbedEngine.error("No last.fm account is linked to this user. Use /lastfm link") ] });
                return;
            }
    
            const user = await lastDb.get(interaction.user.id);
    
            const period = lastfmData.periods.find(e => e.name == (interaction.options.getString("period", false) || "7day"));
    
            const res = await p({
                'url': `http://ws.audioscrobbler.com/2.0/?method=${e.endpoint}&user=${user.name}&api_key=${config.keys.lastfm}&format=json&period=${period.name}`,
                'parse': 'json'
            })

            const embed = EmbedEngine.success(`Your top ${e.name}s - ${period.human}`);


            for(let i = 0; i < 5; i++) {
                const items = res.body[`top${e.name}s`][e.name];

                if(items.hasOwnProperty(i)) {
                    const item = items[i];
    
                    if(item.artist) {
                        embed.addField(`${item.artist.name} - ${item.name}`, `Playcount of ${item.playcount}.`, true)
                    } else {
                        embed.addField(`${item.name}`, `Playcount of ${item.playcount}.`, true)
                    }
                }
            }
    
            await interaction.reply({ embeds: [embed] });
        }
    })

    if(subcommand == "link") {
        const name = interaction.options.getString("name", true);

        const res = await p({
            'url': `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${name}&api_key=${config.keys.lastfm}&format=json`,
            'parse': 'json'
        })

        if(res.body.error) {
            await interaction.reply({ embeds: [ EmbedEngine.error(`User "${name}" does not exist.`) ] });
            return;
        }

        if(!(await lastDb.has(interaction.user.id))) {
            await lastDb.set(interaction.user.id, {
                name
            })

            await interaction.reply({ embeds: [ EmbedEngine.success("First time? Changed last.fm name to " + name + "!") ] });
        } else {
            const user = await lastDb.get(interaction.user.id);

            await interaction.reply({ embeds: [ EmbedEngine.success("Changed last.fm name from " + user.name + " to " + name + "!") ] });
            
            user.name = name;
            await lastDb.set(interaction.user.id, user);
        }
    }

    if(subcommand == "np") {
        if(!(await lastDb.has(interaction.user.id))) {
            await interaction.reply({ embeds: [ EmbedEngine.error("No last.fm account is linked to this user. Use /lastfm link") ] });
            return;
        }

        const user = await lastDb.get(interaction.user.id);

        const res = await p({
            'url': `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user.name}&api_key=${config.keys.lastfm}&format=json`,
            'parse': 'json'
        })

        const track = res.body.recenttracks.track[0];

        if(track["@attr"]) {
            if(track["@attr"].nowplaying) {

                const embed = EmbedEngine.success(`${user.name}'s listening to "${track.artist["#text"]} - ${track.name}"`);

                embed.setURL(embed.url);

                if(track.image.length >= 1) {
                    const image = track.image[track.image.length-1];
                    embed.setThumbnail(image["#text"]);
                } 

                await interaction.reply({ embeds: [ embed ] });
                return;
            }
        }

        await interaction.reply({ embeds: [ EmbedEngine.error(`You're not playing any song.`) ] });
    }
});

export default lastfm;