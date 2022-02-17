import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";

module.exports = {
    //Command metadata
    type: "slash",
    name: "help",
    description: "Information about the bot",
    options: [],

    //Main execution function, this is where you should put command logic
    async execute({ interaction }: { interaction: CommandInteraction }) {
        await interaction.deferReply();
        let prefix = "/";
        const embed = new MessageEmbed()
            .setAuthor({name: "Created by MoonlitJolteon", iconURL: 'https://cdn.discordapp.com/icons/757624148800569506/a_1a0bee00615783ef293ca179af37434c.webp', url: 'https://ko-fi.com/moonlitjolteon'})
            .setColor("#9E2CB2")
            .setTitle("What is Jolt?")
            .setDescription("Jolt is a bot for scouting out other teams, created by Moonlit with the help of Nani Reforged's insight")
            .addField(
                "Why create Jolt instead of using Ignite stats?",
                "While Ignite stats are useful for scouting out individual players, it has little to no functionality when it comes to scouting out teams."
            ).addField(
                "How do I use Jolt?",
                "Jolt has various commands for scouting out teams, most if not all are listed below.\n***__If there are commands you expect to have but are missing, it is actively being worked on after a major API change broke the bot, sorry for the inconvenience__***\nArguments are shown like this: <required> [optional]"
            ).addField(
                "Do you like Jolt?",
                "This is a public bot! You can invite it to your own server with this link https://dsc.gg/jolt-vrml"
            )
            // .addField(
            //     `${prefix}timezone set <timezone>`,
            //     "This is used to set the server's timezone. This is useful for the upcoming command if you're in a timezone other than Eastern Time"
            // ).addField(
            //     `${prefix}timezone clear`,
            //     "This is used to reset the server's timezone back to America/New_York. (Eastern Time)"
            // )
            .addField(
                `${prefix}oculusname <name>`,
                "This will save your oculus username to the bot's storage, allowing you to use stat commands without giving your username."
            ).addField(
                `${prefix}resetsettings`,
                "This will clear the saved user settings."
            )
            .addField(
                `${prefix}stats [username]`,
                "This will get the player stats for the player you search for, or yourself if you don't include a username."
            ).addField(
                `${prefix}teamstats [teamname]`,
                "This will get the stats and the last 6 matches of your team or the team you search for."
            )
            // .addField(
            //     `${prefix}groupstats [teamname]`,
            //     "This will get the stats for each player on your team or the team you search for."
            // ).addField(
            //     `${prefix}upcoming [teamname]`,
            //     "This will get the upcoming matches for your team or the team you searched for, as well as display the date it's scheduled for."
            // ).addField(
            //     `${prefix}teamplayers [teamname]`,
            //     "This will display some team information as well as list the players for your team or the team you search for"
            // )
            .addField(
                "Donations always welcome!",
                "[Buy me a coffee!](https://ko-fi.com/moonlitjolteon)"
            );
            await interaction.editReply({ embeds: [embed] });

    }
} 