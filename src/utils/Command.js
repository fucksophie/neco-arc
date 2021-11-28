import { EventEmitter } from "events";

export default class Command extends EventEmitter {
    constructor(slash) {
        super({});

        this.slash = slash;
    }
}