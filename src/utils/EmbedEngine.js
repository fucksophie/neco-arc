// embed engine

import { MessageEmbed } from "discord.js";

export default class EmbedEngine {

	static error(message)  {
		return new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription("❌ " + message);
	}
	
	static success(message)  {
		return new MessageEmbed()
			.setColor("GREEN")
			.setDescription("💚 " + message);
	}

	static loading(message)  {
		return new MessageEmbed()
			.setColor("GREYPLE")
			.setDescription("⚙️ " + message);
	}	
	
}