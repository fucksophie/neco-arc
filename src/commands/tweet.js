import  { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import {readFileSync} from "fs";

const config = JSON.parse(readFileSync("./config.json").toString());
import { TwitterApi } from 'twitter-api-v2';
import { MessageEmbed } from 'discord.js';

const tweet = new Command(
    new SlashCommandBuilder()
        .setName('tweet')
        .setDescription('Tweet a message!')
		.addStringOption(option =>
			option.setName("tweet")
				.setRequired(true)
				.setDescription("A tweet you wanna post."))
);

tweet.on("interaction", async interaction => {
	await interaction.deferReply();

	const client = new TwitterApi(config.keys.twitter);
	
	const tweetRequest = await client.v1.tweet(`${interaction.options.getString('tweet', true)}\nMessage sent by ${interaction.user.username}#${interaction.user.discriminator}!`);

	await interaction.editReply({ embeds: [
		new MessageEmbed()
			.setAuthor(`${tweetRequest.user.name} (@${tweetRequest.user.screen_name})`, tweetRequest.user.profile_image_url_https)
			.setURL(`https://twitter.com/${tweetRequest.user.screen_name}/status/${tweetRequest.id_str}`)
			.setDescription(tweetRequest.full_text)
			.setTitle("Tweet sucesfully posted!")
			.setFooter("Twitter & neco-arc", "https://abs.twimg.com/icons/apple-touch-icon-192x192.png")
			.setColor("#1DA1F2")
			.setTimestamp()
	]});
});

export default tweet;