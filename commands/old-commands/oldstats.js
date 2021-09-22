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
            permissionLevel: 10,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '[user:member]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [member, ...params]) {
        if(member == undefined) member = message.member;
        let settings = member.user.settings;
        let name = member.user.settings.oculusName ? member.user.settings.oculusName : member.nickname ? member.nickname : member.user.username;
        let missed = settings.missedPractices;
        let sub = settings.substitute ? "Substitute " : "";
        let color = missed >= 3 ? [255, 0, 0] : missed >= 2 ? "RED" : missed >= 1 ? "YELLOW" : "BLUE";
        let embed = new MessageEmbed()
            .setTitle(
                `Stats for ${name}`
            )
            .setColor(color)
            .addField(
                "Position:",
                `${sub}${settings.position}`
            )
            .addField(
                "Float Points",
                settings.floatPoints
            )
            .addField(
                "Missed Practices",
                missed
            )
        message.send({embed})
    }


};
