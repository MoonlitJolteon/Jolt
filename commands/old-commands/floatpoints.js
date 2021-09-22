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
            aliases: ['floats'],
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
            usage: '<set|add|sub|show:default> <user:user> [value:integer]',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: true
        });
    }

    async set(message, [user, value, ...params]) {
        if(value >= 0){
            await user.settings.update('floatPoints', value)
        } else {
            message.send("`Value must be at greater than or equal to 0`")
        }
        message.send(`Float points updated, new value: ${value}`)
    }

    async add(message, [user, value, ...params]) {
        let floatPoints = user.settings.floatPoints
        if(value > 0){
            floatPoints += value
            await user.settings.update('floatPoints', floatPoints)
        } else {
            message.send("`Value must be at greater than 0`")
        }
        message.send(`Float points updated, new value: ${floatPoints}`)
    }

    async sub(message, [user, value, ...params]) {
        let floatPoints = user.settings.floatPoints
        if(value > 0){
            floatPoints -= value
            await user.settings.update('floatPoints', floatPoints)
        } else {
            message.send("`Value must be at greater than 0`")
        }
        message.send(`Float points updated, new value: ${floatPoints}`)
    }

    async show(message, [user, ...params]) {
        message.send(`${user.username}'s current float points: ${user.settings.floatPoints}`)
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
