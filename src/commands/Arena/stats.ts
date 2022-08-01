import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import nodeHtmlToImage from "node-html-to-image";
import * as fs from 'fs/promises';

import { bot } from '../../index';
import * as ignite from '../../helpers/igniteAPI';
import * as vrml from '../../helpers/vrmlAPI';
import * as divColor from '../../helpers/divisionBasedColors';
import * as supporters from '../../res/supporters.json';
import { LaunchOptions, Puppeteer } from "puppeteer";

let errorNoUser = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Please set your oculus name first using \`/oculusname\`, or search for another user by specifying a user.`);
// let errorNoPlayer = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`It would appear that there`);
let errorNoStats = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription("I was unable to find your stats. Also note that this feature is powered by Ignite stats, and if you haven't been spectated by `www.ignitevr.gg` before than it won't find any stats.");


function round(num: number, places: number) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

module.exports = {
    //Command metadata
    type: "slash",
    name: "stats",
    description: "Get a player's stats",
    options: [
        {
            name: "username",
            description: "Oculus username to search for",
            type: "STRING",
            required: false
        }
    ],

    //Main execution function, this is where you should put command logic
    async execute({ interaction }: { interaction: CommandInteraction }) {
        await interaction.deferReply();
        let userToFind = interaction.options.getString('username');
        if (userToFind == undefined) {
            userToFind = await bot.oculusNames.get(interaction!.member!.user.id);
        }
        if (userToFind == undefined) return interaction.editReply({ embeds: [errorNoUser] });
        const {bestPlayer, playerInfo} = await vrml.getPlayerInfo(userToFind);
        
        if (bestPlayer == undefined) return interaction.editReply({ embeds: [errorNoStats] });

        let igniteData = await ignite.getPlayerCache(bestPlayer.name);
        // if (igniteData == undefined) return interaction.editReply({ embeds: [errorNoStats] });

        let html = '<p>Something broke.. contact MunelitJolty#0447 if you see this message and tell her what you did to get it</p>';
        await fs.readFile(__dirname.replace("\\", "/") + '/../../res/layouts/stats.handlebars').then(data => {
            html = data.toString();
        });
	const streamURL = playerInfo.user.streamUrl;
        const vrml_player = playerInfo.thisGame.bioCurrent;
        let avatarURL: string;
        if (vrml_player == undefined) avatarURL = "http://www.readyatdawn.com/wp-content/uploads/2017/07/GAMES_echoarena_render_character_06.jpg";
        else avatarURL = `http://vrmasterleague.com${vrml_player?.userLogo}`;

        const teamName = vrml_player?.teamName;
        const teamExists = vrml_player.teamName != undefined;
        const teamInfo = teamExists ? await vrml.getTeamInfoCache(vrml_player.teamID) : undefined;
        const teamLogoURL = teamExists ? `http://vrmasterleague.com${teamInfo.teamLogo}` : undefined;
        const divisionURL = teamExists ? `http://vrmasterleague.com${teamInfo.divisionLogo}` : undefined;
        const division = teamExists ? teamInfo.divisionName : undefined;
        const teamWL = teamExists ? `${teamInfo.w}-${teamInfo.l}` : undefined;

        const backgroundColors = teamExists ? divColor.divisionBasedColor(division) : divColor.defaultColorScheme;
        const panel = backgroundColors.panel;
        const background = backgroundColors.background;
        const switchDivision = backgroundColors.switchDivision;
        const country = teamExists ? vrml_player.country.toLowerCase() : undefined;

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
        
        const playerStats = igniteData?.player[0] ?? {
            game_count: 0,
            inverted_time: 0,
            play_time: 0,
            player_number: 0,
            possession_time: 0,
            profile_image: null,
            profile_page: null,
            total_2_pointers: 0,
            total_3_pointers: 0,
            total_assists: 0,
            total_blocks: 0,
            total_catches: 0,
            total_goals: 0,
            total_interceptions: 0,
            total_passes: 0,
            total_points: 0,
            total_saves: 0,
            total_shots_taken: 0,
            total_steals: 0,
            total_stuns: 0,
            total_wins: 0
          };

        const content = {
            avatarSource: avatarURL,
            teamExists,
            logoSource: teamLogoURL,
            teamName,
            score,
            teamWL,
            username: bestPlayer.name ?? "Unknown",
            division: divisionURL,
            panel,
            background,
            playerStats,
            playerStatsError: undefined,
            win_rate: `${isNaN(round((playerStats.total_wins / playerStats.game_count) * 100, 2)) ? 0 : round((playerStats.total_wins / playerStats.game_count) * 100, 2)}%`,
            save_rate: isNaN(round(playerStats.total_saves / playerStats.game_count, 2)) ? 0 : round(playerStats.total_saves / playerStats.game_count, 2)
        }

        let image = await nodeHtmlToImage({
            html,
            content
        }) as Buffer;


        let attach = new MessageAttachment(image, 'stats.png');
        const supporterThanks = (supporters as any)[userToFind.toLowerCase()];
        const embed = new MessageEmbed()
            .setTitle(`Stats for ${bestPlayer.name}:`)
            .setImage(`attachment://stats.png`)
            .setFooter({ text: "Created by MoonlitJolteon, Bot available here: https://dcs.gg/jolt-vrml" });
	let desc = ""
        if (supporterThanks) desc += supporterThanks;
        else desc += "Those who donate get a custom quote here! [Click here to donate, and make sure to give your username and quote!](https://ko-fi.com/moonlitjolteon)";
        if (streamURL != null) desc += `\n\n This player has a twitch channel [(Click here!)](${streamURL})`;
	embed.setDescription(desc);

	interaction.editReply({ embeds: [embed], files: [attach] });

    }
} 
