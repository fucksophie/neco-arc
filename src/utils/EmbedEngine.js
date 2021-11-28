// embed engine

import { MessageEmbed } from "discord.js";

export default class EmbedEngine {

	static error(message)  {
		return new MessageEmbed()
			.setColor("DARK_RED")
			.setTitle("❌ " + message);
	}
	
	static success(message)  {
		return new MessageEmbed()
			.setColor("GREEN")
			.setTitle("💚 " + message);
	}

	static loading(message)  {
		return new MessageEmbed()
			.setColor("GREYPLE")
			.setTitle("⚙️ " + message);
	}	
	
}