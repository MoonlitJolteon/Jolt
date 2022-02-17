import * as Slasho from 'discord-slasho';
import * as dotenv from 'dotenv';
import Enmap from 'enmap';
dotenv.config();


class customApp extends Slasho.App<any> {
    oculusNames: Enmap<string | number, any>;
    constructor(options: Slasho.Config, state: any) {
        super(options, state);
        this.oculusNames = new Enmap('oculusNames');
    }
}

export const bot = new customApp( {
    token: process.env.TOKEN!,
    devGuild: process.env.DEV_ID || '',
    intents: ["GUILDS"],
    commandsDir: __dirname.replace("\\", "/") + "/commands"
}, {});


bot.launch().then(() => {
    // bot.dev();
    // bot.production();
    bot.client.user!.setPresence({ activities: [{type: 'COMPETING', name: 'VRML with /help' }], status: 'online' })
});