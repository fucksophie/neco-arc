import { MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import p from "phin";

import { readFileSync, writeFileSync, existsSync } from 'fs';

import { lastfmData } from "../data.js"
import { lastfm as lastDb } from "../databases.js";
import EmbedEngine from '../EmbedEngine.js';

const config = JSON.parse(readFileSync("./config.json").toString());

export const chartInteractionHandler = async (interaction) => {
	if(!(await lastDb.has(interaction.user.id))) {
		await interaction.reply({ embeds: [ EmbedEngine.error("No last.fm account is linked to this user. Use /lastfm link") ] });
		return;
	}

	await interaction.deferReply();
	
	const user = await lastDb.get(interaction.user.id);
	const period = lastfmData.periods.find(e => e.name == (interaction.options.getString("period", false) || "7day"));

	const sizes = {
		album: [300, 300],
		count:  [2, 2]
	};

	const size = lastfmData.sizes.find(e => e[0] == interaction.options.getString("size", false));

	if(size) {
		sizes.count = size[1];
	}
	
	const embed = EmbedEngine.success(`Charted albums`);

	const requiredAlbumAmount = sizes.count[0] * sizes.count[1];
	
	const res = await p({
		'url': `http://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums&user=${user.name}&api_key=${config.keys.lastfm}&format=json&period=${period.name}`,
		'parse': 'json'
	})

	const items = res.body.topalbums.album;
	
	let currentX = 0;
	let currentY = 0;

	const canvas = Canvas.createCanvas(sizes.album[0] * sizes.count[0],
		sizes.album[1] * sizes.count[1]);

	const ctx = canvas.getContext('2d')
	
	if(requiredAlbumAmount >= items.length) {
		await interaction.editReply({ embeds: [EmbedEngine.error(`You don't seem to have enough listened albums. We need at least ${requiredAlbumAmount}!`)] });
		return;
	}
	
	for(let i = 0; i < requiredAlbumAmount; i++) {
		if(items.hasOwnProperty(i)) {
			const item = items[i];

			if(item.image.length >= 1) {                            
				const imageURL = item.image[item.image.length-1]["#text"];
				const hash = imageURL.split(/[\\/]/).pop();
				let image;

				if(!existsSync("./lastfm_cache/" + hash)) {
					const res = await p({
						url: imageURL
					})

					writeFileSync("./lastfm_cache/" + hash, res.body)
					
					image = new Canvas.Image();
					image.src = res.body;
				} else {
					image = new Canvas.Image();
					image.src = "./lastfm_cache/" + hash;
				}
				
				ctx.drawImage(image, currentX, currentY);
				
				const strings = [
					item.artist.name,
					item.name,
					item.playcount
				]

				ctx.font = `20px sans-serif`;

				ctx.fillStyle = "white";
				ctx.shadowColor = "black";
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 2;

				strings.forEach((e, i) => {
					ctx.fillText(e, currentX+10, currentY+(18.5*i)+25);
				})

				currentX += sizes.album[0];

				if (currentX >= (sizes.album[0]*sizes.count[0])) {
					currentX = 0;
					currentY += sizes.album[1];
				}

				await interaction.editReply({ embeds: [EmbedEngine.success(`${i+1}/${requiredAlbumAmount}`)] });
			}
		}
	}

	const stream = canvas.createPNGStream();
	
	const attachment = new MessageAttachment(stream, "chart.png");
	embed.setImage("attachment://chart.png");
	
	try {
		await interaction.editReply({ embeds: [embed], files: [attachment]});
	} catch(o_0) {
		await interaction.editReply({ embeds: [EmbedEngine.error(`Couldn't upload image! We could be experiencing ratelimits or slow internet. :)`)] });
	}
}