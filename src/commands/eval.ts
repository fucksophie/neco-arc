import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ClientApplication, CommandInteraction } from 'discord.js';
import Command from '../types/Command.js';

import EmbedEngine from '../types/EmbedEngine.js';

const evalCommand = new Command(
    new SlashCommandBuilder()
        .setName('eval')
        .addStringOption(option =>
            option.setName('javascript')
                .setDescription('write javascript to evaluate')
                .setRequired(true))
        .setDescription('wooow javascript')
);


evalCommand.on("interaction", async (interaction: CommandInteraction<CacheType>) => {
	const app: ClientApplication = await interaction.client.application.fetch();

	if(interaction.user.id == app.owner.id) {
		try {
			const result = eval(interaction.options.getString("javascript", true));
			
			await interaction.reply({ embeds: [ EmbedEngine.success(`${await clean(result)}`) ] });
		} catch(e) {
			await interaction.reply({ embeds: [ EmbedEngine.error(`Experienced error: \`${e}\``) ] });
		}
	} else {
    	await interaction.reply({ embeds: [ EmbedEngine.error("You're not the owner of this application.") ] });
	}
});

async function clean(text: string){
	if (text && text.constructor.name == "Promise")
		text = await text;
	
	if (typeof text !== "string")
		text = require("util").inspect(text, { depth: 1 });
	
	text = text
	  .replace(/`/g, "`" + String.fromCharCode(8203))
	  .replace(/@/g, "@" + String.fromCharCode(8203));
	
	return text;
}

export default evalCommand;