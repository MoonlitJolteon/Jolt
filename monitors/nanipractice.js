const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Monitor {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: true
        });
    }

    async run(message) {
        if(message.guild == undefined) return;
        if(message.channel != '803382386233835550' && message.channel != '879397449012244480') return;

        let todayNum = (new Date()).getDay();
        let todaySched;
        switch(todayNum) {
            case 1:
                todaySched = "Today we have scheduled practice at 8:30pm Eastern Timezone";
                break;
            case 2:
            case 4:
                todaySched = "Today we have scheduled practice at 8:30pm Eastern Timezone";
                break;
            default:
                todaySched = "We have no scheduled practice today, but you can practice on your own."
        }

        let embed = new MessageEmbed()
            .addField("**Do we have practice today?**", todaySched)
            .addField("Nani's Normal Practice Schedule (Eastern Time)", `Every Monday at 8:30pm\nEvery Tuesday at 8:30pm\nEvery Thursday at 8:30pm`)
            .setColor('#9a009a');

        if(message.content.toLowerCase().includes('practice') && message.content.toLowerCase().includes('when')) {
            message.send({embed})
        }
    }

    async init() {
    }

};
