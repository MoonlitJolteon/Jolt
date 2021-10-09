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
            aliases: ['upcoming'],
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

        let prefix = message.guild.settings.prefix[0]
        let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Set your oculus username using \`${prefix}oculusname set <username>\` to use this command without a teamname, or search for a team by doing \`${prefix}upcoming <teamname>\`.`);
        if(!teamName) {
            let name = message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
            msg = await message.send(`Searching for your team...`)
            if(name == invalid) return message.send({embed});
            teamName = await vrml.getPlayerTeamCache(name);
            embed.setDescription("Your team doesn't appear to exist, is your oculus name stored correctly? (Caps matter)");
            if(name == invalid) return message.send({embed});
        }

        msg = await message.send(`Searching for ${teamName}...`)
        let teamInfo = await vrml.getTeamInfoCache(teamName);
        embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")
        
        if(teamInfo == invalid) return msg.edit({embed})
        let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.logo}`
        let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
        let division = teamInfo.division;
        let teamWL = `${teamInfo.w}-${teamInfo.t}-${teamInfo.l}`
        let rank = teamInfo.rank;

        await msg.edit(`Searching for ${teamInfo.name}'s matches...`)
        let teamID = teamInfo.id;
        let upcomingMatches = await vrml.getTeamMatchesCache(false, teamID);
        let lastSevenMatches = upcomingMatches.splice(0, 7);

        await fs.readFile('./teamUpcomingMatches.handlebars').then((data) => {
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
        for(let i = 0; i < lastSevenMatches.length; i++) {
            let match = lastSevenMatches[i];
            let teams = {
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name
            }
            let datetime = new Date(`${match.dateScheduled} GMT+0000`);
            let date = `${numsToDate.numToDay(datetime.getDay())} ${numsToDate.numToMonth(datetime.getMonth(), true)} ${datetime.getDate()}`;
            let time24 = datetime.toTimeString().split(' ')[0].split(':').splice(0, 2).join(':');
            let time = `${time24.split(':')[0] > 12 ? time24.split(':')[0]-12 : time24.split(':')[0]}:${time24.split(':')[1]}${time24.split(':')[0] > 12 ? "PM" : "AM"}`;
            let generated = new Date();
            generated.setDate(generated.getDate() - (generated.getDay() + 6) % 7);
            generated.setHours(9, 0, 0, 0);
            let scheduled = generated < datetime;
            let current = new Date()
            let pastTime = current > datetime;
            let newMatch = {
                teams,
                scheduled,
                scheduledText: scheduled ? "scheduled" : "not-scheduled",
                match,
                date,
                time, 
                pastTime
            }
            matches.push(newMatch);
        }

        let castingLinks = "";
        matches.forEach(match => {
          if(match.match.castingInfo.caster) {
            if(match.match.castingInfo.channel) {
              castingLinks += `***${match.teams.awayTeam} vs ${match.teams.homeTeam}:*** ${match.match.castingInfo.channel}`;
            } else {
              castingLinks += `***${match.teams.awayTeam} vs ${match.teams.homeTeam}:*** No Link Available Yet`;
            }
          }
        })

        let content = {
            logoSource: teamLogoURL,
            teamName: teamInfo.name,
            score,
            teamWL: teamWL,
            divisionURL,
            division,
            panel,
            background,
            matches,
            rank
        };

        let image = await nodeHtmlToImage({
            html: html,
            content,
            puppeteerArgs: { args: ["--no-sandbox"] }
        })

        let attach = new MessageAttachment(image);
        msg.delete();
        message.send(castingLinks, {files: [attach]});

    
    }

    async init() {
    }

};
