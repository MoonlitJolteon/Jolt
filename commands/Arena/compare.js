const { MessageEmbed } = require('discord.js');
const { Command } = require('klasa');
const vrml = require("../../helpers/vrmlAPI");


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
            permissionLevel: 0,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '<teamName1:string> <teamName2:string>',
            usageDelim: ' | ',
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [teamName1, teamName2, ...params]) {
        let comparison = await vrml.compareTeamsCache(teamName1, teamName2);
        let embed = new MessageEmbed()
            .setTitle(`${teamName1} vs ${teamName2} stats`)
            .setColor('#4444b0')
            .addField(
                "Current Ranks",
                `${teamName1}: ${comparison.team1Rank}\n${teamName2}: ${comparison.team2Rank}`
            )
            .addField(
                "Number of Played Rounds",
                `${teamName1}: ${comparison.team1History[0].played}\n${teamName2}: ${comparison.team2History[0].played}`
            )
            .addField(
                "Number of Rounds Won",
                `${teamName1}: ${comparison.team1History[0].win}\n${teamName2}: ${comparison.team2History[0].win}`
            )
            .addField(
                "Round Win Percentage",
                `${teamName1}: ${comparison.team1History[0].winPercentage}%\n${teamName2}: ${comparison.team2History[0].winPercentage}%`
            )
            .addField(
                "Points Percentage",
                `${teamName1}: ${comparison.team1History[0].roudsWinPercentage}%\n${teamName2}: ${comparison.team2History[0].roudsWinPercentage}%`
            )
        
        message.send({embed});
    }

    async init() {
    }

};
