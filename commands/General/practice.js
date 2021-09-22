const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            runIn: ['text', 'dm', 'group'],
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
            permissionLevel: 3,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {
        let todayNum = (new Date()).getDay();
        let todaySched;
        switch(todayNum) {
            case 1:
                todaySched = "Today we have scheduled practice at 9pm Eastern Timezone";
                break;
            case 2:
            case 4:
                todaySched = "Today we have scheduled practice at 8pm Eastern Timezone";
                break;
            default:
                todaySched = "We have no scheduled practice today, but you can practice on your own."
        }

        let embed = new MessageEmbed()
            .addField("**Do we have practice today?**", todaySched)
            .addField("Nani's Normal Practice Schedule (Eastern Time)", `Every Monday at 9pm\nEvery Tuesday at 8pm\nEvery Thursday at 8pm`)
            .setColor('#9a009a');

        if(message.content.includes('practice')) {
            message.send({embed})
        }
    }

};
