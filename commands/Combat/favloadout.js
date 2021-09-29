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
            runIn: ['text', 'dm', 'group'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: ['loadout'],
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
            usage: '<playername:string>',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [playerName, ...params]) {
        const embed = new MessageEmbed().setTitle(`${playerName}'s Favorite Loadout`).setColor("#0000FF")
        let playerData = await combat.getPlayerCache(playerName)
        let favLoadout = combat.getLoadout(parseInt(playerData.top_loadout[0][0]));
        // message.send(JSON.stringify(favLoadout, null, 4))
        embed.addField(
            "***Percentage Of Use***",
            `${playerData.top_loadout[0][1] * 100}%`
        )
        .addField(
            "***Weapon***",
            favLoadout.weapon,
            true
        )
        .addField(
            "***Ordnance***",
            favLoadout.ordnance,
            true
        )
        .addField(
            "***Tac Mod***",
            favLoadout.tacMod,
            true
        );
        message.send({embed});
    }

    async init() {
    }

};
