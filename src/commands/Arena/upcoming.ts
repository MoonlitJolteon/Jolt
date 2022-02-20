import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import nodeHtmlToImage from "node-html-to-image";
import * as fs from 'fs/promises';
import dayjs from 'dayjs';
import fuzzysort from "fuzzysort";
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat)

import { bot } from '../../index';
import * as ignite from '../../helpers/igniteAPI';
import * as vrml from '../../helpers/vrmlAPI';
import * as divColor from '../../helpers/divisionBasedColors';

let errorNoUser = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Please set your oculus name first using \`/oculusname\`, or search for another user by specifying a user.`);
let errorNoTeam = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription("I was unable to find the team, please make sure you spelled the team name correctly. Do note that if the team is retired, or has never gone active, I won't be able to find your team.");

module.exports = {
  //Command metadata
  type: "slash",
  name: "upcoming",
  description: "Get a team's upcoming matches",
  options: [
    {
      name: "teamname",
      description: "VRML team to search for",
      type: "STRING",
      required: false
    }
  ],

  async execute({ interaction }: { interaction: CommandInteraction }) {
    await interaction.deferReply();
    let teamToFind = interaction.options.getString('teamname');
    let teamID;
    if (teamToFind == undefined) {
      let userToFind = await bot.oculusNames.get(interaction!.member!.user.id);
      if (userToFind == undefined) return interaction.editReply({ embeds: [errorNoUser] });
      let igniteData = await ignite.getPlayerCache(userToFind);
      interaction.editReply("Searching for your team...");
      teamToFind = igniteData?.vrml_player?.team_name;
      teamID = igniteData?.vrml_player?.team_id

    } else {
      interaction.editReply(`Searching for ${teamToFind}...`);
    }

    if (teamToFind == undefined) return interaction.editReply({ embeds: [errorNoTeam] });
    if (teamID == undefined) {
      let teams;
      teams = await vrml.searchTeamNameCache(teamToFind);
      if (teams.length <= 0) return interaction.editReply({ embeds: [errorNoTeam] });


      let teamsSorted = fuzzysort.go(teamToFind, teams, { key: "name" });
      teamID = teams.filter((team: { name: string; }) => team.name == teamsSorted[0].target)[0].id;
    }

    const teamInfo = await vrml.getTeamInfoCache(teamID);
    if (teamInfo == undefined) return interaction.editReply({ embeds: [errorNoTeam] });
    const teamLogoURL = `https://www.vrmasterleague.com/${teamInfo.teamLogo}`
    const divisionURL = `https://www.vrmasterleague.com/${teamInfo.divisionLogo}`
    const division = teamInfo.divisionName;
    const teamWL = `${teamInfo.w}-${teamInfo.l}`
    const rank = teamInfo.rank;
    let region = teamInfo.regionName;
    const teamName = teamInfo.teamName;

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

    await interaction.editReply(`Searching for ${teamName}'s matches...`);
    let upcomingMatches = await vrml.getTeamMatchesCache(false, teamID);

    let html = '<p>Something broke.. contact MunelitJolty#0447 if you see this message and tell her what you did to get it</p>';
    await fs.readFile(__dirname.replace("\\", "/") + '/../../res/layouts/upcoming.handlebars').then((data) => {
      html = data.toString();
    })


    let backgroundColors = divColor.divisionBasedColor(division);
    let panel = backgroundColors.panel;
    let background = backgroundColors.background;
    let switchDivision = backgroundColors.switchDivision;

    let score;
    if (switchDivision == "Master" && region != "OA") {
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
    for (let i = 0; i < upcomingMatches.length; i++) {
      let match = upcomingMatches[i];
      let teams = {
        homeTeam: match.homeTeam.teamName.split('<i>')[0],
        awayTeam: match.awayTeam.teamName.split('<i>')[0]
      }
      let datetime = new Date(`${match.dateScheduledUTC} GMT+0000`);
      // const timezone = message.guild.settings.timezone;
      const timezone = bot.guildSettings.get(`${interaction!.guildId!}-timezone`);
      let date = dayjs(datetime).tz(timezone || "America/New_York").format("dddd D [@] h:mmA z");

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
      content
    }) as Buffer;

    let attach = new MessageAttachment(image, 'teamstats.png');
    let embed = new MessageEmbed()
      .setTitle(`${teamInfo.teamName}'s stats:`)
      .setDescription(`${teamInfo.bio.discordInvite ? `Team Discord: ${teamInfo.bio.discordInvite}` : ""}\nTeam Page: [Click Here](https://vrmasterleague.com/EchoArena/Teams/${teamInfo.teamID})`)
      .setImage(`attachment://teamstats.png`)
      .setFooter({text: `If this server works out of a different timezone than displayed, the server admins can run \`/timezone set <timezone abbrevation>\` to change what timezone this is based on.`});

    matches.forEach(match => {
      if (match.match.castingInfo.caster) {
        if (match.match.castingInfo.channelURL) {
          embed.addField(
            `Casting link for ${match.teams.awayTeam} vs ${match.teams.homeTeam}:`,
            `${match.match.castingInfo.channelURL}`
          );
        } else {
          embed.addField(
            `Casting link for ${match.teams.awayTeam} vs ${match.teams.homeTeam}:`,
            `No Link Available Yet`
          );
        }
      }
    })
    interaction.editReply({ embeds: [embed], files: [attach] });


  }
}