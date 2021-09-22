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
            permissionLevel: 0,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '<set|clear> [name:string]',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: true
        });
    }

    async set(message, [name, ...params]) {
        if(!name) return message.send("```name is a required argument```")
        message.send(`Name Set: ${name}`)
        message.author.settings.update('oculusName', name)
    }

    async clear(message, [...params]) {
        message.author.settings.update('oculusName', '')
        message.send("Oculus name cleared")
    }

};
