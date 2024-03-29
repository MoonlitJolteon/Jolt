const { RichMenu, Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const nodeHtmlToImage = require('node-html-to-image');
const vrml = require("../../helpers/vrmlAPI");
const divColors = require("../../helpers/divisionBasedColor");
const numsToDate = require("../../helpers/numsToDateStuff");
const ignite = require('../../helpers/igniteAPI');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat)
dayjs.tz.setDefault("America/New_York")

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
    if (!teamName) {
      let name = message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
      let data = await ignite.getPlayerCache(name);
      msg = await message.send(`Searching for your team...`)
      if (name == invalid) return message.send({ embed });
      teamName = data.vrml_player.team_name;
      embed.setDescription("Your team doesn't appear to exist, is your oculus name stored correctly? (Caps matter)");
      if (teamName == invalid) return message.send({ embed });
    }

    msg = await message.send(`Searching for ${teamName}...`)

    let teamPossibilities = await vrml.searchTeamNameCache(teamName);
    let teamID;
    if (teamPossibilities.length > 1) {
      let menu = new RichMenu(new MessageEmbed()
        .setColor(0x673AB7)
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
        .setTitle('I found these possible teams:')
        .setDescription('Use the arrow reactions to scroll between pages.\nUse number reactions to select an option.')
      );

      for (const team of teamPossibilities) {
        menu.addOption(' V', team.name);
      }

      const collector = await menu.run(await message.send("Loading teams..."));
      const choice = await collector.selection;

      if (choice === null) {
        return collector.message.delete();
      }

      teamID = teamPossibilities[parseInt(choice)].id;
    } else if(teamPossibilities.length > 0) {
      teamID = teamPossibilities[0].id;
    } else {
      teamID = undefined;
    }

    let teamInfo = await vrml.getTeamInfoIDCache(teamID);

    embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")

    if (teamInfo == invalid) return msg.edit({ embed })
    else teamInfo = teamInfo.team;  
    let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.teamLogo}`
    let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
    let division = teamInfo.divisionName;
    let teamWL = `${teamInfo.w}-${teamInfo.l}`
    let rank = teamInfo.rank;

    await msg.edit(`Searching for ${teamInfo.teamName}'s matches...`)
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
    if (switchDivision == "Master") {
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
    for (let i = 0; i < lastSevenMatches.length; i++) {
      let match = lastSevenMatches[i];
      let teams = {
        homeTeam: match.homeTeam.teamName,
        awayTeam: match.awayTeam.teamName
      }
      let datetime = new Date(`${match.dateScheduledUTC} GMT+0000`);
      const timezone = message.guild.settings.timezone;
      let date = dayjs(datetime).tz(timezone).format("dddd D [@] h:mmA z");


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
        time: undefined,
        pastTime
      }
      matches.push(newMatch);
    }

    let content = {
      logoSource: teamLogoURL,
      teamName: teamInfo.teamName,
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

    let attach = new MessageAttachment(image, 'upcomingmatches.png');
    let supporters = require("../../supporters.json");
    embed = new MessageEmbed()
      .setTitle(`${teamInfo.teamName}'s upcoming matches:`)
      .setDescription(`If this server works out of a different timezone than displayed, the server admins can run \`${prefix}timezone set <timezone abbrevation>\` to change what timezone this is based on.\nIf there are casted matches, the links will be available here.`)
      .attachFiles(attach)
      .setImage(`attachment://upcomingmatches.png`);

    matches.forEach(match => {
      if (match.match.castingInfo.caster) {
        if (match.match.castingInfo.channelURL) {
          embed.addField(
            `${match.teams.awayTeam} vs ${match.teams.homeTeam}:`,
            `${match.match.castingInfo.channelURL}`
          );
        } else {
          embed.addField(
            `${match.teams.awayTeam} vs ${match.teams.homeTeam}:`,
            `No Link Available Yet`
          );
        }
      }
    })

    msg.delete();
    message.channel.send({ embed });


  }

  async init() {
  }

};
