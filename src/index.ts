import { Client, Intents, Collection, GuildMember } from 'discord.js';
import { readdirSync } from 'fs';
import Command from './types/Command.js';

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

client.on("messageCreate", async message => {
	/*
	DiscordAPIError: Unknown User
    at RequestHandler.execute (C:\Users\pirdi\Desktop\Codes\neco-arc\node_modules\discord.js\src\rest\RequestHandler.js:349:13)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async RequestHandler.push (C:\Users\pirdi\Desktop\Codes\neco-arc\node_modules\discord.js\src\rest\RequestHandler.js:50:14)
    at async GuildMemberManager._fetchSingle (C:\Users\pirdi\Desktop\Codes\neco-arc\node_modules\discord.js\src\managers\GuildMemberManager.js:388:18)
    at async Client.<anonymous> (file:///C:/Users/pirdi/Desktop/Codes/neco-arc/src/index.js:22:18) {
  method: 'get',
  path: '/guilds/899763349162700850/members/910863136029028372',
  code: 10013,
  httpStatus: 404,
  requestData: { json: undefined, files: [] }*/
  
	const user: GuildMember = await message.guild.members.fetch(message.author);
	if(user.roles.cache.find(e => e.name == "neco-arc-fakemute")) {
		await message.delete();
	}
})

client.login(process.env.TOKEN);
