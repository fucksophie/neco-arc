import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const slashCommands = [];

const commands = readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// https://stackoverflow.com/a/66703757
for await (const commandFile of commands) {
    slashCommands.push((await import(`./commands/${commandFile}`)).default.slash)
};

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

//rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommands.map(e => e.toJSON()) })
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, "899763349162700850"), { body: slashCommands.map(e => e.toJSON()) })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
