import { CommandInteraction } from "discord.js";
import { bot } from '../index';

module.exports = {
    //Command metadata
    type: "slash",
    name: "oculusname",
    description: "Set your username for more convenient commands",
    options: [
        {
            name: "username",
            description: "Username to set",
            type: "STRING",
            required: true
        }
    ],

    //Main execution function, this is where you should put command logic
    async execute({ interaction }: { interaction: CommandInteraction }) {
        await interaction.deferReply();
        await bot.oculusNames.set(interaction!.member!.user.id, interaction!.options!.getString('username'));
        await interaction.editReply(`Your oculus username has been set to ${bot.oculusNames.get(interaction!.member!.user.id)}`);
    },
} 