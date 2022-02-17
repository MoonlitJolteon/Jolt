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
let errorNoStats = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription("I was unable to find your stats, please make sure you spelled your oculus username correctly, caps matter. Also note that this feature is powered by Ignite stats, and if you haven't been spectated by `www.ignitevr.gg` before than it won't know you exist");


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

        let igniteData = await ignite.getPlayerCache(userToFind);
        if (igniteData == undefined) return interaction.editReply({ embeds: [errorNoStats] });

        let html = '<p>Something broke.. contact MunelitJolty#0447 if you see this message and tell her what you did to get it</p>';
        await fs.readFile(__dirname.replace("\\", "/") + '/../../res/layouts/stats.handlebars').then(data => {
            html = data.toString();
        });

        const vrml_player = igniteData.vrml_player;
        let avatarURL: string;
        if (igniteData.vrml_player == undefined) avatarURL = "http://www.readyatdawn.com/wp-content/uploads/2017/07/GAMES_echoarena_render_character_06.jpg";
        else avatarURL = vrml_player?.player_logo;

        const teamName = vrml_player?.team_name;
        const teamExists = vrml_player.team_name != undefined;
        const teamInfo = teamExists ? await vrml.getTeamInfoCache(vrml_player.team_id) : undefined;
        const teamLogoURL = teamExists ? vrml_player.team_logo : undefined;
        const divisionURL = teamExists ? teamInfo!.divisionLogo : undefined;
        const division = teamExists ? teamInfo!.divisionName : undefined;
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

        const playerStats = igniteData.player[0];

        const content = {
            avatarSource: avatarURL,
            teamExists,
            logoSource: teamLogoURL,
            teamName,
            score,
            teamWL,
            username: userToFind,
            division: divisionURL,
            panel,
            background,
            playerStats,
            playerStatsError: undefined,
            win_rate: `${round((playerStats.total_wins / playerStats.game_count) * 100, 2)}%`,
            save_rate: round(playerStats.total_saves / playerStats.game_count, 2)
        }

        let image = await nodeHtmlToImage({
            html,
            content
        }) as Buffer;




        let attach = new MessageAttachment(image, 'stats.png');
        const supporterThanks = (supporters as any)[userToFind.toLowerCase()];
        const embed = new MessageEmbed()
            .setTitle(`Stats for ${igniteData.player[0].player_name}:`)
            .setImage(`attachment://stats.png`)
            .setFooter({ text: "Created by MoonlitJolteon, Bot available here: https://dcs.gg/jolt-vrml" });
        if (supporterThanks) embed.setDescription(supporterThanks);
        else embed.setDescription("Those who donate get a custom quote here! [Click here to donate, and make sure to give your username and quote!](https://ko-fi.com/moonlitjolteon)");
        interaction.editReply({ embeds: [embed], files: [attach] });

    }
} 