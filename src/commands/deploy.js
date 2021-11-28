import { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../utils/Command.js';
import EmbedEngine from '../utils/EmbedEngine.js';
import commands from "../utils/data.js"

const deploy = new Command(
    new SlashCommandBuilder()
        .setName('deploy')
		.setDescription("Edit slash command deployments")
		.addBooleanOption(option =>
			option.setRequired(true)
				.setName("global")
					.setDescription("Do you wish to execute the following action in the Global context?"))
		.addBooleanOption(option =>
			option.setRequired(true)
				.setName("delete")
				.setDescription("Delete slash commands in the current context."))
		.addBooleanOption(option =>
			option.setRequired(true)
				.setName("register")
				.setDescription("Register slash commands in the current context."))
);

deploy.on("interaction", async interaction => {
	const app = await interaction.client.application.fetch();

	if(interaction.user.id !== app.owner.id) {
    	await interaction.reply({ embeds: [ EmbedEngine.error("You're not the owner of this application.") ] });
		return;
	}

	let finished = "Executed the following actions: ";

	if(interaction.options.getBoolean("delete", true)) {
		if(interaction.options.getBoolean("global", true)) {
			finished += "Deleted all slash commands globally. ";
			await app.commands.set([]);
		} else {
			await interaction.client.guilds.cache.get(interaction.guildId).commands.set([])
			finished += "Deleted all slash commands in this guild. ";
		}
	}

	if(interaction.options.getBoolean("register", true)) {
		if(interaction.options.getBoolean("global", true)) {
			await app.commands.set(commands.map(e => e.slash.toJSON()));
			finished += "Registered  `" + commands.map(e => e.slash.name).join("`, `") + "` globally. ";		
		} else {
			await interaction.client.guilds.cache.get(interaction.guildId).commands.set(commands.map(e => e.slash.toJSON()));
			finished += "Registered  `" + commands.map(e => e.slash.name).join("`, `") + "` in this guild. ";	
		}
	}

	await interaction.reply({ embeds: [ EmbedEngine.success(finished) ] });	
});

export default deploy;