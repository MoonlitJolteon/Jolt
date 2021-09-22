const { Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const nodeHtmlToImage = require('node-html-to-image');
const vrml = require("../../helpers/vrmlAPI");
const divColors = require("../../helpers/divisionBasedColor");
const numsToDate = require("../../helpers/numsToDateStuff");
const invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";


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
            usage: '[teamName:string]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [teamName, ...params]) {
        let msg;
        let html = "<head><style>body{width:100px; height:50px;}</style></head><body>Error Encountered</body>";

        let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription("Set your oculus username using `!oculusname set <username>` to use this command without a teamname, or search for a team by doing `!upcoming <teamname>`.");
        if(!teamName) {
            let name = message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
            msg = await message.send(`Searching for your team...`)
            if(name == invalid) return message.send({embed});
            teamName = await vrml.getPlayerTeamCache(name);
            embed.setDescription("Your team doesn't appear to exist, is your oculus name stored correctly? (Caps matter)");
            if(teamName == invalid) return message.send({embed});
        }

        msg = await message.send(`Searching for ${teamName}...`)
        embed.setDescription("The team doesn't appear to exist, if you searched for a team double check your spelling, otherwise, double check you spelled your oculus username right. (Caps Matter)")
        
        let teamInfo = await vrml.getTeamInfoCache(teamName);
        if(teamInfo == invalid) return msg.edit({embed})
        let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.logo}`
        let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
        let division = teamInfo.division;
        let teamWL = `${teamInfo.w}-${teamInfo.t}-${teamInfo.l}`
        let rank = teamInfo.rank;

        await msg.edit(`Searching for ${teamName}'s matches...`)
        let teamID = teamInfo.id;
        let historicMatches = await vrml.getTeamMatchesCache(true, teamID);
        let lastSixMatches = historicMatches.splice(0, 6);

        await fs.readFile('./teamMatches.handlebars').then((data) => {
            html = data.toString();
        })

        let backgroundColors = divColors.divisionBasedColor(division);
        let panel = backgroundColors.panel;
        let background = backgroundColors.background;
        let switchDivision = backgroundColors.switchDivision;

        let score;
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
        
        let matches = [];
        for(let i = 0; i < lastSixMatches.length; i++) {
            let match = lastSixMatches[i];
            let teams = {
                [match.homeTeam.id]: {name: match.homeTeam.name, score: match.homeScore},
                [match.awayTeam.id]: {name: match.awayTeam.name, score: match.awayScore}
            }
            let winningTeam = teams[match.winningTeamID];
            let losingTeam = teams[match.losingTeamID];
            let searchedTeamWon = teamInfo.name == winningTeam.name;
            let datetime = new Date(`${match.dateScheduled} GMT+0000`);
            let date = `${numsToDate.numToMonth(datetime.getMonth(), true)} ${datetime.getDate()}`;
            let newMatch = {
                winningTeam,
                losingTeam,
                searchedTeamWon,
                match,
                date
            }
            matches.push(newMatch);
        }

        let image = await nodeHtmlToImage({
            html: html,
            content: {
                logoSource: teamLogoURL,
                teamName: teamName,
                score,
                teamWL: teamWL,
                divisionURL,
                division,
                panel,
                background,
                matches,
                rank
            }
        })

        let attach = new MessageAttachment(image);
        msg.delete();
        message.send(attach);

    
    }

    async init() {
    }

};
