const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 5,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '<set|clear> [position:string]',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: true
        });
    }

    async set(message, [position, ...params]) {
        if(!position) return message.send("`position is a required argument`");
        await message.send(`Position: ${position}`)
        message.author.settings.update('position', position)
        
    }

    async clear(message, [...params]) {
        message.author.settings.update('position', "None")
    }

};
