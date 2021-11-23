// embed engine

import { MessageEmbed } from "discord.js";

export default class EmbedEngine {

	public static error(message: string): MessageEmbed {
		return new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription("❌ " + message);
	}
	
	public static success(message: string): MessageEmbed {
		return new MessageEmbed()
			.setColor("GREEN")
			.setDescription("💚 " + message);
	}

	public static loading(message: string): MessageEmbed {
		return new MessageEmbed()
			.setColor("GREYPLE")
			.setDescription("⚙️ " + message);
	}	

}