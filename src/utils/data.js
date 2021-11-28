import { readdirSync } from 'fs';

export const reactionData = {
    reactions: [
        {
            name: "kill",
            action: "fucking killed"
        },
        {
            name: "hug",
            action: "hugged :3"
        },
        {
            name: "dodge",
            action: "DODGED"
        },
        {
            name: "kiss",
            action: "kissed 0_0"
        },
        {
            name: "lick",
            action: "licked??"
        },
        {
            name: "love",
            action: "loves"
        },
        {
            name: "slap",
            action: "slapped"
        },
        {
            name: "wave",
            action: "waves :) to"
        },
        {
            name: "trap",
            action: "trapped o_o"
        }
    ]
}
export const lastfmData = {    
    periods: [
        {
            name: "7day",
            human: "7 Days"
        },
        {
            name: "1month",
            human: "1 Month"
        },
        {
            name: "3month",
            human: "3 Months"
        },
        {
            name: "6month",
            human: "6 Months"
        },
        {
            name: "12months",
            human: "1 Year"
        },
        {
            name: "overall",
            human: "Overall"
        }
    ],
    top: [
        {
            name: "album",
            endpoint: "user.getTopAlbums"
        },
        {
            name: "artist",
            endpoint: "user.getTopArtists"
        },
        {
            name: "track",
            endpoint: "user.getTopTracks"
        }
    ]
}

const commands = [];

readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(async A => {
	commands.push((await import(`../commands/${A}`)).default);
});

export default commands;