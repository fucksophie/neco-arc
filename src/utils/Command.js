import { EventEmitter } from "events";
import { readdirSync } from 'fs';

class Command extends EventEmitter {
    constructor(slash) {
        super({});

        this.slash = slash;
    }
}

const commands = [];

readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(async A => {
	commands.push((await import(`../commands/${A}`)).default);
});

export { commands, Command } ;