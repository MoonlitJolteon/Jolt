const { Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const vrml = require("../../helpers/vrmlAPI");
const nodeHtmlToImage = require('node-html-to-image');
const divColors = require('../../helpers/divisionBasedColor')
const invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚"

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
        embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")
        
        let teamInfo = await vrml.getTeamInfoCache(teamName);

        embed  = embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")
        if(teamInfo == invalid) return msg.edit({embed})

        let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.logo}`;
        let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`;
        let division = teamInfo.division;
        let teamWL = `${teamInfo.w}-${teamInfo.t}-${teamInfo.l}`;
        let recruiting = teamInfo.isRecruiting ? "Yes" : "No";

        await msg.edit(`Getting players on ${teamInfo.name}...`);
        let players = await vrml.getTeamPlayersCache(teamInfo.id);

        
        let backgroundColors = divColors.divisionBasedColor(division);
        let panel = backgroundColors.panel;
        let background = backgroundColors.background;
        let switchDivision = backgroundColors.switchDivision;
        

        let image;
        await fs.readFile('./teamInfoLayout.handlebars').then((data) => {
            html = data.toString();
        })

        let mmr = teamInfo.mmr;
        let score = teamInfo.pts;
        let cycleScore = teamInfo.cycleScoreTotal;
        let cycleScorePM = teamInfo.cyclePlusMinus; 
        image = await nodeHtmlToImage({
            html: html,
            content: {
                logoSource: teamLogoURL,
                teamName: teamInfo.name,
                ladder: switchDivision != "Master",
                mmr,
                score,
                cycleScore,
                cycleScorePM,
                teamWL,
                divisionLogo: divisionURL,
                division,
                players: players.players,
                panel,
                background,
                recruiting
            },
            puppeteerArgs: { args: ["--no-sandbox"] }
        })
        let attach = new MessageAttachment(image);
        msg.delete();
        message.send(attach);

    }

    async init() {
    }

};
