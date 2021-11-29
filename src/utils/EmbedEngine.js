import { MessageEmbed } from "discord.js";

export default class EmbedEngine {

	static error(message)  {
		return new MessageEmbed()
			.setColor("DARK_RED")
			.setTimestamp()
			.setTitle("❌ " + message);
	}
	
	static success(message)  {
		return new MessageEmbed()
			.setColor("GREEN")
			.setTimestamp()
			.setTitle("💚 " + message);
	}

	static loading(message)  {
		return new MessageEmbed()
			.setColor("GREYPLE")
			.setTimestamp()
			.setTitle("⚙️ " + message);
	}	
	
}