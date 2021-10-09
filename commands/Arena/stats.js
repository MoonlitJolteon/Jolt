const { Command } = require('klasa');
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

  async run(message, [oculusUsername, ...params]) {

    let invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
    let msg = await message.send(`Searching for ${oculusUsername ? oculusUsername : "you"}...`)
    let playerStatsError;
    let html = "<head><style>body{width:100px; height:50px;}</style></head><body>Error Encountered</body>";

    let name = oculusUsername ? oculusUsername : message.author.settings.oculusName ? message.author.settings.oculusName : invalid;
    let prefix = message.guild.settings.prefix[0]
    let embed = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Please set your oculus name first using \`${prefix}oculusname set <name>\`, or search for another user using \`${prefix}stats <name>\``);

    if (name == invalid) return msg.edit({ embed });
    let data = await ignite.getPlayerCache(name);
    let avatarURL;

    let teamName = invalid;
    embed = embed.setDescription("I was unable to find your stats, please make sure you spelled your oculus username correctly, caps matter.")
    if (data == invalid || data.vrml_player.player_logo == undefined) {
      avatarURL = "http://www.readyatdawn.com/wp-content/uploads/2017/07/GAMES_echoarena_render_character_06.jpg";
    } else {
      avatarURL = data.vrml_player.player_logo
    };
    await msg.edit(`Searching for ${name ? `${name}'s` : "your"} stats...`);
    teamName = data.vrml_player.team_name;

    let teamExists = teamName != invalid && teamName != undefined;
    let teamInfo = await vrml.getTeamInfoIDCache(data.vrml_player.team_id)
    let teamLogoURL = data.vrml_player.team_logo;
    let divisionURL = teamInfo.divisionLogo;
    let division = teamInfo.division;
    let teamWL = `${teamInfo.w}-${teamInfo.t}-${teamInfo.l}`;

    await fs.readFile('./statsLayout.handlebars').then((data) => {
      html = data.toString();
    })

    let backgroundColors = teamExists ? divColors.divisionBasedColor(division) : divColors.default;
    let panel = backgroundColors.panel;
    let background = backgroundColors.background;
    let switchDivision = backgroundColors.switchDivision;
    let country = data.vrml_player.country != "none" ? data.vrml_player.country.toLowerCase() : undefined;


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
      teamWL: teamWL,
      username: name,
      division: divisionURL,
      panel,
      background,
      country,
      playerStats,
      playerStatsError,
      win_rate: `${round((playerStats.total_wins / playerStats.game_count)*100, 2)}%`,
      save_rate: round(playerStats.total_saves / playerStats.game_count, 2)
    }

    let image = await nodeHtmlToImage({
      html,
      content,
      puppeteerArgs: { args: ["--no-sandbox"] }
    })

    let attach = new MessageAttachment(image);
    msg.delete();
    let supporters = require("../../supporters.json");
    let supporterThanks = supporters[name.toLowerCase()];
    message.send(supporterThanks, { files: [attach] });;

  }

  async init() {
  }

};
