const { MessageEmbed } = require('discord.js');
const { Command } = require('klasa');
const combat = require("../../helpers/combatAPI");


function round(num, places) {
  var multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier
}

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
            permissionLevel: 0,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '[playerName:string]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [playerName, ...params]) {
        const invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        const prefix = message.guild.settings.prefix[0]
        let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Please set your oculus name first using \`${prefix}oculusname set <name>\`, or search for another user using \`${prefix}stats <name>\``);
        let name = playerName ? playerName :  message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
        if(name == invalid) return message.send({embed})
        
        embed.setTitle(`Combat Stats for \`${name}\``).setColor("#0000FF").setDescription("Powered by [ECRanked](https://www.ecranked.com/), more detailed stats can be found there.")
        let playerData = await combat.getPlayerCache(name)
        let playerStats = playerData.weekly_stats;
        let loadout = combat.getLoadout(playerStats.top_loadout[0][0])
        embed.addField(
            "Total Games",
            playerStats.total_games,
            true
        )
        .addField(
            "Total Deaths",
            playerStats.total_deaths,
            true
        )
        .addField(
            "Average Speed",
            `${round(playerStats.average_speed, 2)} m/s`,
            true
        )
        .addField(
          "Average Ping",
          `${round(playerStats.average_ping, 1)}ms`,
          true
        )
        .addField(
          "Idle Time",
          `${round(100*playerStats.percent_stopped, 2)}%`,
          true
        )
        .addField(
          "Inverted",
          `${playerStats.percent_upsidedown > 0.5 ? "Yes" : "No"} (${round(playerStats.percent_upsidedown * 100, 1)}%)`,
          true
        )
        .addField(
          "Average Deaths",
          round(playerStats.average_deaths, 2),
          true
        
        )
        .addField(
          "Loadout",
          `${loadout.weapon}\n${loadout.ordnance}\n${loadout.tacMod}`,
          true
        )
        .setFooter("Data as of Sep 1st, 2021.");
        
        if(playerStats.discord_name) embed.addField(`${name}'s discord name`, playerStats.discord_name, true);
        
        if(playerStats.about_string) embed.addField(`About ${name}`, playerStats.about_string, true);


        message.send({embed});

        // CTP: Dyson/Combustion
        // Payload: Fission/Surge
    }

    async init() {
    }

};
