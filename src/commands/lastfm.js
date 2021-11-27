import { SlashCommandBuilder } from '@discordjs/builders';
import Command from '../utils/Command.js';
import { lastfm as lastDb } from "../databases.js";
import p from "phin";
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync("./config.json").toString());

import EmbedEngine from '../utils/EmbedEngine.js';

const lastfm = new Command(
    new SlashCommandBuilder()
        .setName('lastfm')
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
        .setDescription("last.fm in Discord")
);

lastfm.on("interaction", async interaction=> {
    const subcommand = interaction.options.getSubcommand();

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