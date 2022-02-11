const { Command, RichMenu } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs/promises');
const vrml = require("../../helpers/vrmlAPI");
const nodeHtmlToImage = require('node-html-to-image');
const divColors = require('../../helpers/divisionBasedColor');
const ignite = require('../../helpers/igniteAPI');

function round(num, places) {
  var multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
}

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

  async run(message, [teamName, ...params]) { 
    let msg = await message.send("Loading...");
    if (!teamName) {
      let name = message.author.settings.oculusName ? message.author.settings.oculusName : undefined;
      let data = await ignite.getPlayerCache(name);
      await msg.edit(`Searching for your team...`)
      let prefix = message.guild.settings.prefix[0]
      let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Set your oculus username using \`${prefix}oculusname set <username>\` to use this command without a teamname, or search for a team by doing \`${prefix}upcoming <teamname>\`.`);
      if (name == undefined) return message.send({ embed });
      teamName = await data.vrml_player.team_name;
      embed.setDescription("Your team doesn't appear to exist, is your oculus name stored correctly? (Caps matter)");
      if (teamName == undefined) return message.send({ embed });
    }

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
    } else if (teamPossibilities.length > 0) {
      teamID = teamPossibilities[0].id;
    } else {
      teamID = undefined;
    }

    let teamInfo = await vrml.getTeamInfoIDCache(teamID);
    if (teamInfo) teamInfo = teamInfo.team;
    teamName = teamInfo.teamName;
    let players = await vrml.getTeamPlayersCache(teamInfo.teamID);
    
    let attachedStats = [];
    let supporterThanks = "";
    for (let player of players.players) {
      let invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
      await msg.edit(`Searching for ${player.playerName}...`);
      let playerStatsError;
      let html = "<head><style>body{width:100px; height:50px;}</style></head><body>Error Encountered</body>";

      let name = player.playerName;
      let prefix = message.guild.settings.prefix[0]
      let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Please set your oculus name first using \`${prefix}oculusname set <name>\`, or search for another user using \`${prefix}stats <name>\``);
      if (name == invalid) {
        msg.edit({ embed });
        continue;
      }

      let data = await ignite.getPlayerCache(name);
      embed = embed.setDescription("I was unable to find your stats, please make sure you spelled your oculus username correctly, caps matter. Also note that this feature is powered by Ignite stats, and if you haven't been spectated by `www.ignitevr.gg` before than it won't know you exist");
      if (data == invalid) {
        message.send({ embed });
        continue;
      }

      let avatarURL;

      if (data == invalid || data.vrml_player == undefined) {
        avatarURL = "http://www.readyatdawn.com/wp-content/uploads/2017/07/GAMES_echoarena_render_character_06.jpg";
      } else {
        avatarURL = data.vrml_player.player_logo
      };
      await msg.edit(`Searching for ${name ? `${name}'s` : "your"} stats...`);

      let teamExists = teamName != invalid && teamName != undefined;
      let teamLogoURL = teamExists ? data.vrml_player.team_logo : undefined;
      let divisionURL = teamExists ? teamInfo.divisionLogo : undefined;
      let division = teamExists ? teamInfo.divisionName : undefined;
      let teamWL = teamExists ? `${teamInfo.w}-${teamInfo.l}` : undefined;

      await fs.readFile('./statsLayout.handlebars').then((data) => {
        html = data.toString();
      })

      let backgroundColors = teamExists ? divColors.divisionBasedColor(division) : divColors.default;
      let panel = backgroundColors.panel;
      let background = backgroundColors.background;
      let switchDivision = backgroundColors.switchDivision;
      let country = teamExists ? data.vrml_player.country != "none" && data.vrml_player.country != undefined ? data.vrml_player.country.toLowerCase() : undefined : undefined;


      let score;
      if (teamExists) {
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
      }

      const playerStats = data.player[0];

      let content = {
        name,
        avatarSource: avatarURL,
        teamExists,
        logoSource: teamLogoURL,
        teamName,
        score,
        teamWL,
        username: name,
        division: divisionURL,
        panel,
        background,
        country,
        playerStats,
        playerStatsError,
        win_rate: `${round((playerStats.total_wins / playerStats.game_count) * 100, 2)}%`,
        save_rate: round(playerStats.total_saves / playerStats.game_count, 2)
      }

      let image = await nodeHtmlToImage({
        html,
        content,
        puppeteerArgs: { args: ["--no-sandbox"] }
      })

      let attach = new MessageAttachment(image, `${name}.png`);
      attachedStats.push({ name: name, attachment: attach });
      supporterThanks += "Hi";
    }
    msg.delete();

    for (let file of attachedStats) {
      let supporters = require("../../supporters.json");
      const name = file.name;
      const attachment = file.attachment;
      let embed = new MessageEmbed()
        .setTitle(`Stats for ${name}:`)
        .attachFiles(attachment)
        .setImage(`attachment://${name}.png`);
      if (supporters[name.toLowerCase()]) embed.setDescription(supporters[name.toLowerCase()]);
      else embed.setDescription("Those who donate get a custom quote here! [Click here to donate, and make sure to give your username and quote!](https://ko-fi.com/moonlitjolteon)");
      await message.channel.send({ embed });
    }

    let embed = new MessageEmbed()
      .setColor("#BB0000")
      .setTitle("Are there players you expected stats for that are missing?")
      .setDescription("It likely means that the user either didn't use the same capitalization in VRML as on oculus, or they have no stats to display. Stats are powered by ignite, so if they have never been spectated by `www.ignitevr.gg` then there will be no stats to display.");

    message.channel.send({ embed })
  }

  async init() {
  }

};
