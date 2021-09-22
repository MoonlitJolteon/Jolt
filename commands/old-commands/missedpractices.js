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
            aliases: ['missed'],
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
            await user.settings.update('missedPractices', value)
        } else {
            message.send("`Value must be at greater than or equal to 0`")
        }
        message.send(`Number of missed practices updated, new value: ${value}`)
    }

    async add(message, [user, value, ...params]) {
        let missedPractices = user.settings.missedPractices
        if(value > 0){
            missedPractices += value
            await user.settings.update('missedPractices', missedPractices)
        } else {
            message.send("`Value must be at greater than 0`")
        }
        message.send(`Number of missed practices updated, new value: ${missedPractices}`)
    }

    async sub(message, [user, value, ...params]) {
        let missedPractices = user.settings.missedPractices
        if(value > 0){
            missedPractices -= value
            await user.settings.update('missedPractices', missedPractices)
        } else {
            message.send("`Value must be at greater than 0`")
        }
        message.send(`Number of missed practices updated, new value: ${missedPractices}`)
    }

    async show(message, [user, ...params]) {
        message.send(`${user.username}'s missed practices: ${user.settings.missedPractices}`)
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
