const { RichMenu, Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const vrml = require("../../helpers/vrmlAPI");
const nodeHtmlToImage = require('node-html-to-image');
const divColors = require('../../helpers/divisionBasedColor')
const ignite = require('../../helpers/igniteAPI');
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
    embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")

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
    
    embed = embed.setDescription("The team you're looking for doesn't appear to exist, double check your spelling.")
    if(teamID == undefined) return msg.edit({ embed });
    let teamInfo = await vrml.getTeamInfoIDCache(teamID);

    if (teamInfo == invalid) return msg.edit({ embed })
    else teamInfo = teamInfo.team;

    let teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.teamLogo}`;
    let divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`;
    let division = teamInfo.divisionName;
    let teamWL = `${teamInfo.w}-${teamInfo.l}`;
    let recruiting = teamInfo.isRecruiting ? "Yes" : "No";

    await msg.edit(`Getting players on ${teamInfo.teamName}...`);
    let players = await vrml.getTeamPlayersCache(teamInfo.teamID);


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
        teamName: teamInfo.teamName,
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


    let attach = new MessageAttachment(image, 'players.png');
    let supporters = require("../../supporters.json");
    embed = new MessageEmbed()
        .setTitle(`${teamInfo.teamName}'s players:`)
        .setDescription(`Keep in mind, this doesn't say who the co-captain is, even if there is one marked.`)
        .attachFiles(attach)
        .setImage(`attachment://players.png`);
    msg.delete();
    message.channel.send({embed});

  }

  async init() {
  }

};
