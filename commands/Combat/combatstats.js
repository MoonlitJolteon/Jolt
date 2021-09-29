const { MessageEmbed } = require('discord.js');
const { Command } = require('klasa');
const combat = require("../../helpers/combatAPI");


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
            aliases: [''],
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
            usage: '<playername:string>',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [playerName, ...params]) {
        const embed = new MessageEmbed().setTitle(`${playerName}'s Stats`).setColor("#0000FF")
        let playerData = await combat.getPlayerCache(playerName)
        // message.send(JSON.stringify(favLoadout, null, 4))
        embed.addField(
            "***Total Games***",
            playerData.total_games,
            true
        )
        .addField(
            "***Total Deaths***",
            playerData.total_deaths,
            true
        )
        .addField(
            "***Average Deaths/Game***",
            playerData.average_deaths,
            true
        )
        message.send({embed});

        // CTP: Dyson/Combustion
        // Payload: Fission/Surge
    }

    async init() {
    }

};
