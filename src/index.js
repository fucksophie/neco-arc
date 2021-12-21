import { Client, Intents } from 'discord.js';

import { markov } from "./utils/databases.js";
import { commands } from "./utils/Command.js"
import config from './utils/Config.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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
	
	if(await markov.has(message.channelId)) {
		await markov.push(message.channelId, message.content, false);
	}

	const app = await client.application.fetch();

	if(message.content == "development command injection" && message.author.id == app.owner.id) {
		await message.guild.commands.set(commands.map(e => e.slash.toJSON()))
		await message.reply("Injected all commands into the current guild.")
	}
});

client.login(config.token);
