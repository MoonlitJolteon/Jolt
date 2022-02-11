const { RichMenu, Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const nodeHtmlToImage = require('node-html-to-image');
const vrml = require("../../helpers/vrmlAPI");
const divColors = require("../../helpers/divisionBasedColor");
const numsToDate = require("../../helpers/numsToDateStuff");
const ignite = require('../../helpers/igniteAPI');
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
      usage: '[teamName:string] [careAboutSeason:boolean]',
      usageDelim: ' | ',
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(message, [teamName, careAboutSeason = true]) {
    
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
    embed.setDescription("The team doesn't appear to exist, if you searched for a team double check your spelling, otherwise, double check you spelled your oculus username right. (Caps Matter)")

    // let teamInfo = await vrml.getTeamInfoCache(teamName, message.channel);
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

    // return message.send("Sorry, this feature is currently being rewritten to make it easier to find the correct team, please be patient")
    if (teamInfo == invalid) return msg.edit({ embed })
    else teamInfo = teamInfo.team;
    let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.teamLogo}`
    let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
    let division = teamInfo.divisionName;
    let teamWL = `${teamInfo.w}-${teamInfo.l}`
    let rank = teamInfo.rank;
    let region = teamInfo.regionName;
    teamName = teamInfo.teamName;
    switch (region) {
      case 'America East':
        region = "NA/E";
        break;
      case 'America West':
        region = "NA/W";
        break;
      case 'Europe':
        region = "EU";
        break;
      case 'Oceania/Asia':
        region = "OA";
        break;



    }



    await msg.edit(`Searching for ${teamName}'s matches...`)
    let historicMatches = await vrml.getTeamMatchesCache(true, teamID);

    if (careAboutSeason) {
      let currSeason = await vrml.getCurrentSeasonCache();
      historicMatches = historicMatches.filter(match => match.seasonName == currSeason.seasonName);
    }

    let lastSixMatches = historicMatches.splice(0, 6);

    await fs.readFile('./teamMatches.handlebars').then((data) => {
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
    for (let i = 0; i < lastSixMatches.length; i++) {
      let match = lastSixMatches[i];
      // console.log(match);
      // break;

      let teams = {
        [match.homeTeam.teamID]: { name: match.homeTeam.teamName.split('<i>')[0], score: match.homeScore },
        [match.awayTeam.teamID]: { name: match.awayTeam.teamName.split('<i>')[0], score: match.awayScore }
      }
      let winningTeam = teams[match.winningTeamID];
      let losingTeam = teams[match.losingTeamID];
      let searchedTeamWon = teamInfo.teamID == match.winningTeamID;
      let datetime = new Date(`${match.dateScheduledUTC} GMT+0000`);
      let date = `${numsToDate.numToMonth(datetime.getMonth(), true)} ${datetime.getDate()}`;
      let forfeit = match.isForfeit;
      let newMatch = {
        winningTeam,
        losingTeam,
        searchedTeamWon,
        match,
        date,
        forfeit
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
        rank,
        region
      },
      puppeteerArgs: { args: ["--no-sandbox"] }
    })

    let attach = new MessageAttachment(image, 'teamstats.png');
    let supporters = require("../../supporters.json");
    embed = new MessageEmbed()
        .setTitle(`${teamInfo.teamName}'s stats:`)
        .setDescription(`This only shows the most recent 6 games.\n${teamInfo.bio.discordInvite ? `Team Discord: ${teamInfo.bio.discordInvite}` : ""}\nTeam Page: https://vrmasterleague.com/EchoArena/Teams/${teamInfo.teamID}`)
        .attachFiles(attach)
        .setImage(`attachment://teamstats.png`);
    msg.delete();
    message.channel.send({embed});


  }

  async init() {
  }

};
