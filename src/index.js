import { Client, Intents } from 'discord.js';
import { readFileSync, existsSync, mkdirSync } from 'fs';

import { markov } from "./utils/databases.js";
import commands from "./utils/data.js"

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const config = JSON.parse(readFileSync("./config.json").toString());

client.once('ready', () => {
	console.log('started ' + client.user.username);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = commands.find(e => e.slash.name == interaction.commandName);

	if (!command) return;

	command.emit("interaction", interaction);
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	
	if(!existsSync("./lastfm_cache/")) {
		mkdirSync("./lastfm_cache/")
	}

	if(await markov.has(message.channelId)) {
		await markov.push(message.channelId, message.content, false);
	}
});

client.login(config.token);
