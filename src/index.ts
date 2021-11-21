import { Client, Intents, Collection, GuildMember } from 'discord.js';
import { readdirSync } from 'fs';
import Command from './types/Command.js';
import { markov } from "./databases.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commands: Collection<String, Command> = new Collection();

const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(async commandFile => {
	const command: Command = (await import(`./commands/${commandFile}`)).default;

	commands.set(command.slash.name, command);
});

client.once('ready', () => {
	console.log('started');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command: Command = commands.get(interaction.commandName);

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

client.login(process.env.TOKEN);
