import  { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import {EventEmitter} from "events";

export default class Command extends EventEmitter {
    slash: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;

    constructor(slash: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder) {
        super({});
        this.slash = slash;
    }
}