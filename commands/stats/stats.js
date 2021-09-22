const { Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const vrml = require("../../helpers/vrmlAPI");
const nodeHtmlToImage = require('node-html-to-image');
const divColors = require('../../helpers/divisionBasedColor');
const igniteScraper = require('../../helpers/igniteScraper');

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
            usage: '[oculusUsername:string]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [oculusUsername, ...params]) {
        let invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        let msg = await message.send(`Searching for ${oculusUsername ? oculusUsername : "you"}...`)
        let playerStatsError;
        let html = "<head><style>body{width:100px; height:50px;}</style></head><body>Error Encountered</body>";
        
        let name = oculusUsername ? oculusUsername :  message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
        let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription("Please set your oculus name first using `!oculusname set <name>`, or search for another user using `!stats <name>`");
        if(name == invalid) return msg.edit({embed});
        
        let player = await vrml.getPlayerCache(name);
        let avatarURL;
        let teamName = invalid;
        embed = embed.setDescription("I was unable to find your VRML account, please make sure you spelled your oculus username correctly, caps matter.")
        // if(player == invalid) return msg.edit({embed});
        if(player == invalid) {
            player = {
                name,
                logo: "",
                country: "none"
            }
            avatarURL = "http://www.readyatdawn.com/wp-content/uploads/2017/07/GAMES_echoarena_render_character_06.jpg";
        } else {
            avatarURL = `https://www.vrmasterleague.com/${player.logo}`;
            await msg.edit(`Searching for ${name ? `${name}'s` : "your"} team...`);
            teamName = await vrml.getPlayerTeamCache(name);
        }
        // embed  = embed.setDescription("For the moment this command doesn't work if you aren't on an active team. If you are on one, please make sure you spelled your oculus username correctly, caps matter.")
        // if(teamName == invalid) return msg.edit({embed});
        let teamExists = teamName != invalid;

        await msg.edit(`Searching for ${name ? `${name}'s` : "your"} stats...`)
        let playerStatsPersonal = await igniteScraper.getPlayerStats(player.name);

        let playerStats;
        if(playerStatsPersonal.Level != undefined)  {
            playerStats = playerStatsPersonal
        } else playerStatsError = {
            error: `&nbsp;&nbsp;Couldn't get ${name}'s stats.<br>\
            &nbsp;&nbsp;This could be caused by the oculus name not being<br>\
            &nbsp;&nbsp;the same as the VRML name,<br>\
            &nbsp;&nbsp;or it could simply mean we couldn't find any stats<br>&nbsp;&nbsp;for ${name}.`
        }

        let teamInfo;
        let teamLogoURL;
        let divisionURL;
        let division;
        let teamWL;
        if(teamExists) {
            teamInfo = await vrml.getTeamInfoCache(teamName);
            teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.logo}`
            divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
            division = teamInfo.division;
            teamWL = `${teamInfo.w}-${teamInfo.t}-${teamInfo.l}`
        }

        await fs.readFile('./statsLayout.handlebars').then((data) => {
            html = data.toString();
        })

        let backgroundColors = teamExists ? divColors.divisionBasedColor(division) : divColors.default;
        let panel = backgroundColors.panel;
        let background = backgroundColors.background;
        let switchDivision = backgroundColors.switchDivision;
        let country = player.country != "none" ? player.country.toLowerCase() : undefined;
        

        let score;
        if(teamExists) {
            if(switchDivision == "Master") {
                score = {
                    mmr: false,
                    score: teamInfo.pts
                }
            } else {
                score = {
                    mmr: true,
                    score: teamInfo.mmr
                }
            }
        }

        let content = {
            name,
            avatarSource: avatarURL,
            teamExists,
            logoSource: teamLogoURL,
            teamName,
            score,
            teamWL: teamWL,
            username: name,
            division: divisionURL,
            panel,
            background,
            country,
            playerStats,
            playerStatsError
        }
        
        let image = await nodeHtmlToImage({
            html: html,
            content
        })

        let attach = new MessageAttachment(image);
        msg.delete();
        message.send(attach);

    }

    async init() {
    }

};
