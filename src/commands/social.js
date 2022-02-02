import  { SlashCommandBuilder } from '@discordjs/builders';

import { Command } from '../utils/Command.js';
import config from '../utils/Config.js';

import { TwitterApi } from 'twitter-api-v2';
import { MessageEmbed } from 'discord.js';
import EmbedEngine from '../utils/EmbedEngine.js';

const social = new Command(
    new SlashCommandBuilder()
        .setName('social')
        .setDescription('Perform actions on Social Medias!')
		.addSubcommandGroup(twitterSubcommand => 
			twitterSubcommand
				.setName("twitter")
				.setDescription("Perform actions on twitter, such as send tweets and more.")
				.addSubcommand(tweetSubcommand => 
					tweetSubcommand
						.setName("tweet")
						.setDescription("Send a tweet!")
						.addStringOption(tweetStringOption => 
							tweetStringOption
								.setName("tweet")
								.setRequired(true)
								.setDescription("Some tweet text you wanna send")
						)					
				)
				.addSubcommand(userSubcommand => 
					userSubcommand
						.setName("user")
						.setDescription("View a user")
						.addStringOption(userStringOption => 
							userStringOption
								.setName("user")
								.setRequired(true)
								.setDescription("Username you wanna view")
						)					
				)
		)
);

social.on("interaction", async interaction => {
	await interaction.deferReply();
		console.log("DEFFERED")		

	const category = interaction.options.getSubcommandGroup();
	const type = interaction.options.getSubcommand();
	if(category == "twitter") {
		console.log("twitter category")		
		const client = new TwitterApi(config.keys.twitter);
		
		if(type == "tweet") {
			const tweet = interaction.options.getString("tweet");
			console.log("tweeting " + tweet)		

			try {
						console.log("tweet")		

				const tweetRequest = await client.v1.tweet(`
					${tweet}
					Message sent by ${interaction.user.username}#${interaction.user.discriminator}!
				`.trim());
				console.log("sent tweet")		
		console.log("editing replY")		

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
			console.log("edited reply")		

			} catch (o_o){
				console.log(o_o)
				await interaction.editReply({ embeds: [ EmbedEngine.error("Couldn't post the tweet.")]});
						console.log("error occured")		

			}
		} else if(type == "user") {
			try {
				const user = await client.v1.user({ screen_name: interaction.options.getString("user") });

				await interaction.editReply({ embeds: [
					new MessageEmbed()
						.setAuthor(`${user.name} (@${user.screen_name})`, user.profile_image_url_https)
						.setURL(user.url)
						.setDescription(user.description)
						.setFooter("Twitter & neco-arc", "https://abs.twimg.com/icons/apple-touch-icon-192x192.png")
						.setColor("#" + user.profile_sidebar_border_color)
						.setTimestamp(user.created_at)
				]});
			} catch (o_o){
				console.log(o_o)
				await interaction.editReply({ embeds: [ EmbedEngine.error("Couldn't fetch user.")]});
			}
		}
	}


});

export default social;
