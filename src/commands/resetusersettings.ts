import { CommandInteraction } from "discord.js";
import { bot } from '../index';

module.exports = {
    //Command metadata
    type: "slash",
    name: "resetusersettings",
    description: "Clear your personal settings from the bot's memory.",
    options: [
    ],

    //Main execution function, this is where you should put command logic
    async execute({ interaction }: { interaction: CommandInteraction }) {
        await interaction.deferReply();
        await bot.oculusNames.delete(interaction!.member!.user.id)
        await interaction.editReply(`Your oculus username has been cleared.`);
    },
} 