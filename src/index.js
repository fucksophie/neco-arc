import { Client, Intents, Collection } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';
import { markov } from "./databases.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commands = new Collection();

const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));

const config = JSON.parse(readFileSync("./config.json").toString());

commandFiles.forEach(async commandFile => {
	const command = (await import(`./commands/${commandFile}`)).default;

	commands.set(command.slash.name, command);
});

client.once('ready', () => {
	console.log('started ' + client.user.username);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) return;

	command.emit("interaction", interaction);
});

// on a message, if the markov chain exists add to it
client.on('messageCreate', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	
	if(await markov.has(message.channelId)) {
		await markov.push(message.channelId, message.content, false);
	}
});

client.login(config.token);
