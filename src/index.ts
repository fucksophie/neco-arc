import { Client, Intents, Collection } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';
import Command from './types/Command.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

client.login(process.env.TOKEN);
