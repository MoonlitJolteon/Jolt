const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: language => language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(message) {
		let prefix = message.guild.settings.prefix[0];
		const embed = new MessageEmbed()
			.setAuthor("Created by MoonlitJolteon", 'https://cdn.discordapp.com/avatars/237360479624757249/a_a74caf90d6f72ebe7877812d39f53eb7.webp', 'https://vrmasterleague.com/EchoArena/Players/Pq1xQLQziZxndaFTWAA2oA2')
			.setColor("#9E2CB2")
			.setTitle("What is NaniBot?")
			.setDescription("NaniBot is a bot for scouting out other teams created by Nani Reforged")
			.addField(
				"Why create NaniBot instead of using Ignite stats?",
				"While Ignite stats are useful for scouting out individual players, it has little to no functionality when it comes to scouting out teams."
			).addField(
				"How do I use NaniBot?",
				"NaniBot has various commands for scouting out teams, most if not all are listed below.\nArguments are shown like this: <required> [optional]"
			).addField(
				`${prefix}oculusname set <name>`,
				"This will save your oculus username to the bot's storage, allowing you to use !stats without giving your username."
			).addField(
				`${prefix}oculusname clear`,
				"This will clear the saved username."
			)
			// .addField(
			// 	`${prefix}position set <position>`,
			// 	"This will save your preferred position, currently only works when using stats for yourself."
			// ).addField(
			// 	`${prefix}position clear`,
			// 	"This will clear preferred position."
			// )
			.addField(
				`${prefix}stats [username]`,
				"This will get the player stats for the player you search for, or yourself if you don't include a username."
			).addField(
				`${prefix}teamstats [teamname]`,
				"This will get the stats and the last 6 matches of your team or the team you search for."
			).addField(
				`${prefix}upcoming [teamname]`,
				"This will get the upcoming matches for your team or the team you searched for, as well as display the date it's scheduled for."
			).addField(
				`${prefix}teamplayers [teamname]`,
				"This will display some team information as well as list the players for your team or the team you search for"
			).addField(
				`${prefix}compare <team1> | <team2>`,
				"This will compare a few stats from the two teams that are searched for"
			);
		return message.send({embed});
	}

};
